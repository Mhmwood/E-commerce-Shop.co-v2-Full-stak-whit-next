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
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
