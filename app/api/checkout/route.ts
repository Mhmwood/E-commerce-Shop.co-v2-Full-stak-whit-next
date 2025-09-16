// api/checkout/route.ts

import { stripe } from "@lib/stripe";
import { prisma } from "@lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: true,
    },
  });

  if (!cartItems.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const line_items = cartItems.map((item) => {
    const discountedPrice =
      item.product.price * (1 - (item.product.discountPercentage || 0) / 100);
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
          description: item.product.description,
        },
        unit_amount: Math.round(discountedPrice * 100),
      },
      quantity: item.quantity,
    };
  });

  try {
    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id.toString(),
      },
    });
    console.log(
      "Creating Stripe session with metadata userId:",
      session.user.id
    );

    return NextResponse.json({ url: sessionStripe.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create Stripe session" },
      { status: 500 }
    );
  }
}
