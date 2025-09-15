/* eslint-disable @typescript-eslint/no-unused-vars */
import { updateProductRating } from "@/lib/api/products-utils/updateProductRating";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

async function uploadImageFromUrl(
  url: string,
  bucket = "products"
): Promise<string> {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());

  const uniqueName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.jpg`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(uniqueName, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(uniqueName);

  return publicUrl.publicUrl;
}

async function main() {
  const addFakeProducts = async () => {
    await prisma.product.deleteMany();
    const res = await fetch("https://dummyjson.com/products?limit=50");

    const { products } = await res.json();

    for (const p of products) {
      const thumbnailUrl = await uploadImageFromUrl(p.thumbnail);

      const imageUrls = await Promise.all(
        (p.images ?? []).map((imgUrl: string) =>
          uploadImageFromUrl(imgUrl, "products")
        )
      );

      await prisma.product.create({
        data: {
          title: p.title,
          description: p.description,
          price: p.price,
          stock: p.stock,
          thumbnail: thumbnailUrl,
          images: imageUrls,
          tags: p.tags ?? [],
          brand: p.brand,
          sku: p.sku,
          weight: p.weight,
          discountPercentage: p.discountPercentage,
          shippingInformation: p.shippingInformation,
          warrantyInformation: p.warrantyInformation,
          availabilityStatus: "InStock",
          returnPolicy: "30-day return policy",
          minimumOrderQuantity: 1,
          category: p.category,
          dimensions: {
            create: {
              width: p.dimensions.width,
              height: p.dimensions.height,
              depth: p.dimensions.depth,
            },
          },
          meta: {
            create: {
              barcode: p.meta.barcode,
              qrCode: p.meta.qrCode,
            },
          },
        },
      });
    }

    console.log("✅ Dummy products seeded with Supabase images");
  };
  const addFakeProductReview = async () => {
    await prisma.productReview.deleteMany();
    const products = await prisma.product.findMany();

    const names = [
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Hannah",
      "Ivan",
      "Julia",
    ];

    const productReviews = [
      "Amazing quality, highly recommend!",
      "The product works as expected.",
      "Very satisfied with my purchase.",
      "Exceeded my expectations!",
      "Not worth the price.",
      "Fast shipping and good packaging.",
      "The color is not as shown.",
      "Great value for money.",
      "I would buy this again.",
      "Poor quality, broke after a week.",
      "Comfortable and stylish.",
      "Arrived late but good condition.",
      "Instructions were clear and helpful.",
      "Customer service was excellent.",
      "Size runs a bit small.",
      "High-quality material.",
      "Packaging could be improved.",
      "Exactly what I was looking for.",
      "The product feels cheap.",
      "Very durable and sturdy.",
      "Loved the design and color.",
      "Would not recommend to a friend.",
      "Easy to assemble and use.",
      "Works perfectly for my needs.",
      "The product is okay, nothing special.",
      "Fantastic product, will order again.",
      "Too big for my liking.",
      "Soft and comfortable to wear.",
      "The smell was unpleasant at first.",
      "Colors are vibrant and nice.",
      "Product arrived damaged.",
      "Fast delivery, happy with purchase.",
      "Not satisfied with the material.",
      "Exactly as described.",
      "Feels premium and well-made.",
      "Could be more user-friendly.",
      "Love the texture and feel.",
      "Stopped working after a month.",
      "Great gift for a friend.",
      "Highly recommend this brand.",
      "Not as durable as expected.",
      "Perfect fit for me.",
      "Good product, will buy again.",
      "The stitching is coming apart.",
      "Affordable and good quality.",
      "Looks great in person.",
      "The size chart is confusing.",
      "Exceeded my expectations in every way.",
      "Mediocre, nothing special.",
      "Very happy with this purchase.",
      "Product quality could be improved.",
    ];

    const userId = "aa55bb5c-e771-44fd-b3a8-7f1df7c43e77";

    for (const product of products) {
      for (let i = 0; i < 3; i++) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomReview =
          productReviews[Math.floor(Math.random() * productReviews.length)];
        const randomRating = Math.floor(Math.random() * 3) + 3; // rating 1-5

        await prisma.productReview.create({
          data: {
            rating: randomRating,
            comment: randomReview,
            reviewerName: randomName,
            productId: product.id,
            userId,
          },
        });
        await updateProductRating(product.id);
      }
    }

    console.log("✅ 50 fake product reviews created for each product");
  };

  //addFakeProducts(); // this will delet all products and add new products
  //addFakeProductReview(); // this will delet all Review and add new Review
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
