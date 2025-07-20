import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let rawBody: Buffer;
  try {
    const buf = await request.arrayBuffer();
    rawBody = Buffer.from(buf);
  } catch (err) {
    console.error("Failed to read request body.", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;

    if (!userId) {
      console.warn("No userId found in session metadata.");
      return NextResponse.json(
        { error: "Missing userId in metadata" },
        { status: 400 }
      );
    }

    try {
      // جلب عناصر السلة الحالية
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        console.warn(`No cart items found for user: ${userId}`);
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      // حساب المجموع الكلي
      const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );

      // إنشاء الطلب مع العناصر المرتبطة
      await prisma.order.create({
        data: {
          userId,
          totalAmount,
          status: "PAID",
          shippingAddress: "To be implemented", // يمكن تعديلها لاحقًا
          paymentMethod: "card",
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // مسح عناصر السلة بعد إنشاء الطلب
      await prisma.cartItem.deleteMany({ where: { userId } });

      console.log(`Order created and cart cleared for user: ${userId}`);

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Failed to process order after payment:", error);
      return NextResponse.json(
        { error: "Failed to process order" },
        { status: 500 }
      );
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
    return NextResponse.json({ received: true });
  }
}
