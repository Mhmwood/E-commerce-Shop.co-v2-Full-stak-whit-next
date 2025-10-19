import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BASE_URL } from "./utils";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const product = await fetch(
    `${BASE_URL}/api/products/${id}?select=title,description,thumbnail`
  ).then((res) => (res.ok ? res.json() : null));

  if (!product) return notFound();

  return {
    title: product.title,
    description:
      product.description?.slice(0, 160) ||
      "Discover great products at shop.co",
    openGraph: {
      title: product.title,
      description: product.description,
      url: `${BASE_URL}/product/${id}`,
      images: [
        {
          url: product.thumbnail || "/defaultProfile",
          // width: 295,
          // height: 298,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.thumbnail || "/defaultProfile",
          // width: 295,
          // height: 298,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
  };
}

export const metadata: Metadata = {
  title: {
    default: "shop.co",
    template: "%s | shop.co",
  },
  description:
    "shop.co is the ultimate online platform to buy and sell top-quality products. Fast checkout, secure payments, and a seamless shopping experience.",
  keywords: ["shop", "ecommerce", "buy", "sell", "products", "online shopping"],
  authors: [{ name: "shop.co", url: "https://github.com/mhmwood" }],
  creator: "Mhmwood Saad",
  publisher: "Mhmwood Saad",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL!),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Shop.co - Home",
    description: "Shop.co is your online store for the latest trends",
    url: process.env.NEXTAUTH_URL,
    siteName: "Shop.co",
    images: [
      {
        url: "/github/home.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    title: "Shop.co - Home",
    description: "Shop.co is your online store for the latest trends",
    images: [
      {
        url: "/github/home.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};
