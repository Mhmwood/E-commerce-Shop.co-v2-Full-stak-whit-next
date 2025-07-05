// lib/seo.ts
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://shop.co";

  const product = await fetch(
    `${baseUrl}/api/products/${params.id}?select=title,description,thumbnail`
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
      url: `${baseUrl}/product/${params.id}`,
      images: [
        {
          url: product.thumbnail || "/default-og.png",
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.thumbnail || "/default-og.png"],
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
  metadataBase: new URL("https://shop.co"),
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
  // openGraph: {
  //   title: "shop.co",
  //   description: "shop.co is a platform for buying and selling products",
  //   url: "https://shop.co",
  //   siteName: "shop.co",
  //   images: [
  //     {
  //       url: "/og-image.png",
  //       width: 1200,
  //       height: 630,
  //       alt: "shop.co",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "shop.co",
  //   description: "shop.co is a platform for buying and selling products",
  //   images: ["/og-image.png"],
  // },
};
