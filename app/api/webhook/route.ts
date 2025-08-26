import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export function GET() {
  return new NextResponse("⚡⚡⚡GET request received");
}

export async function POST(req: NextRequest) {
  console.log("⚡ Webhook triggered");

  const rawBody = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event;
  try {

    if (!process.env.STRIPE_WEBHOOK_SECRET)
      throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`✅ Event received: ${event.type}`);

    if (
      event.type === "checkout.session.completed" ||
      event.type === "payment_intent.succeeded" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      console.log(
        "Processing checkout.session.completed or payment_intent.succeeded"
      );
      console.log("Event data:", event.data.object);
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session?.metadata?.userId;
      if (!userId) {
        console.error("Missing userId in metadata");
        return new NextResponse("Missing userId in metadata", { status: 400 });
      }
      console.log("User ID from metadata:", userId);
      try {
        const cartItems = await prisma.cartItem.findMany({
          where: { userId },
          include: { product: true },
        });

        if (cartItems.length === 0) {
          console.warn(`No cart items found for user: ${userId}`);
          return new NextResponse("Cart is empty", { status: 400 });
        }

        const totalAmount = cartItems.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );

        const shippingAddress = "Not provided";

        const order = await prisma.order.create({
          data: {
            userId,
            totalAmount,
            status: "PAID",
            shippingAddress,
            paymentMethod: session.payment_method_types?.[0] || "card",
            orderItems: {
              create: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
        });

        await prisma.cartItem.deleteMany({ where: { userId } });

        console.log(
          `✅ Order created: ${order.id}, cart cleared for user: ${userId}`
        );
      } catch (error: any) {
        console.error("❌ Order processing failed:", error.message);
        return new NextResponse(`Order processing failed: ${error.message}`, {
          status: 500,
        });
      }
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook signature failed", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
