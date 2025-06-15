import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.productReview.deleteMany();
  await prisma.productMeta.deleteMany();
  await prisma.productDimensions.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const users = await prisma.user.createMany({
    data: [
      {
        name: "User One",
        email: "user1@example.com",
        image:
          "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      },
      {
        name: "User Two",
        email: "user2@example.com",
        image:
          "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      },
      {
        name: "User Three",
        email: "user3@example.com",
        image:
          "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      },
    ],
    skipDuplicates: true,
  });

  const allUsers = await prisma.user.findMany();

  const categoriesData = [
    { name: "Laptops" },
    { name: "Smartphones" },
    { name: "Accessories" },
    { name: "Home Appliances" },
  ];
  const categories = await prisma.category.createMany({
    data: categoriesData,
    skipDuplicates: true,
  });
  const allCategories = await prisma.category.findMany();

  const productsData = [
    {
      title: 'MacBook Pro M3 14"',
      description: "High-performance Apple laptop with M3 chip",
      price: 2499.99,
      discountPercentage: 5,
      rating: 4.8,
      stock: 30,
      tags: ["apple", "macbook", "m3"],
      brand: "Apple",
      sku: "MBP-M3-14",
      weight: 1.6,
      warrantyInformation: "1 year global warranty",
      shippingInformation: "Ships in 1-3 business days",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return policy",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      categoryId: allCategories.find((c) => c.name === "Laptops")!.id,
      dimensions: { width: 31.2, height: 22.1, depth: 1.6 },
      meta: { barcode: "1234567890123", qrCode: "macbook-m3-qr" },
    },
    {
      title: "Dell XPS 13",
      description: "Compact and powerful Windows laptop",
      price: 1399.99,
      discountPercentage: 7,
      rating: 4.5,
      stock: 40,
      tags: ["dell", "xps", "laptop"],
      brand: "Dell",
      sku: "DELL-XPS13",
      weight: 1.3,
      warrantyInformation: "1 year manufacturer warranty",
      shippingInformation: "Ships in 2-4 business days",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return policy",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      categoryId: allCategories.find((c) => c.name === "Laptops")!.id,
      dimensions: { width: 30.2, height: 20.1, depth: 1.4 },
      meta: { barcode: "1234567890456", qrCode: "dell-xps-qr" },
    },
    {
      title: "iPhone 15 Pro",
      description: "Latest Apple smartphone with advanced camera",
      price: 1099.99,
      discountPercentage: 3,
      rating: 4.9,
      stock: 50,
      tags: ["apple", "iphone", "smartphone"],
      brand: "Apple",
      sku: "IPH15-PRO",
      weight: 0.2,
      warrantyInformation: "1 year warranty",
      shippingInformation: "Ships in 1-3 business days",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return policy",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      categoryId: allCategories.find((c) => c.name === "Smartphones")!.id,
      dimensions: { width: 7.5, height: 15.0, depth: 0.8 },
      meta: { barcode: "1234567890789", qrCode: "iphone15-qr" },
    },
    {
      title: "Samsung Galaxy S23",
      description: "Samsung's flagship Android smartphone",
      price: 999.99,
      discountPercentage: 4,
      rating: 4.7,
      stock: 60,
      tags: ["samsung", "galaxy", "smartphone"],
      brand: "Samsung",
      sku: "SAMS-GS23",
      weight: 0.19,
      warrantyInformation: "1 year warranty",
      shippingInformation: "Ships in 1-3 business days",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return policy",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      categoryId: allCategories.find((c) => c.name === "Smartphones")!.id,
      dimensions: { width: 7.2, height: 14.9, depth: 0.79 },
      meta: { barcode: "1234567890999", qrCode: "galaxys23-qr" },
    },
    {
      title: "Wireless Headphones",
      description: "Noise cancelling Bluetooth headphones",
      price: 199.99,
      discountPercentage: 10,
      rating: 4.3,
      stock: 70,
      tags: ["headphones", "wireless", "audio"],
      brand: "Sony",
      sku: "SONY-WH1000XM4",
      weight: 0.25,
      warrantyInformation: "2 years warranty",
      shippingInformation: "Ships in 2-5 business days",
      availabilityStatus: "in stock",   
      returnPolicy: "30-day return policy",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      categoryId: allCategories.find((c) => c.name === "Accessories")!.id,
      dimensions: { width: 18.0, height: 20.0, depth: 7.0 },
      meta: { barcode: "1234567890111", qrCode: "sony-wh1000xm4-qr" },
    },
    {
      title: "Gaming Mouse",
      description: "High precision wired gaming mouse",
      price: 59.99,
      discountPercentage: 15,
      rating: 4.6,
      stock: 80,
      tags: ["mouse", "gaming", "accessories"],
      brand: "Logitech",
      sku: "LOGI-G502",
      weight: 0.12,
      warrantyInformation: "1 year warranty",
      shippingInformation: "Ships in 1-3 business days",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return policy",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      categoryId: allCategories.find((c) => c.name === "Accessories")!.id,
      dimensions: { width: 7.5, height: 4.0, depth: 12.5 },
      meta: { barcode: "1234567890222", qrCode: "logi-g502-qr" },
    },
    {
      title: "Air Conditioner",
      description: "Energy efficient split air conditioner",
      price: 499.99,
      discountPercentage: 8,
      rating: 4.2,
      stock: 25,
      tags: ["ac", "home", "appliance"],
      brand: "LG",
      sku: "LG-AC-1234",
      weight: 30,
      warrantyInformation: "3 years warranty",
      shippingInformation: "Ships in 7-14 business days",
      availabilityStatus: "in stock",
      returnPolicy: "7-day return policy",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      categoryId: allCategories.find((c) => c.name === "Home Appliances")!.id,
      dimensions: { width: 90.0, height: 30.0, depth: 25.0 },
      meta: { barcode: "1234567890333", qrCode: "lg-ac-qr" },
    },
    {
      title: "Microwave Oven",
      description: "Compact microwave oven with grill",
      price: 129.99,
      discountPercentage: 12,
      rating: 4.0,
      stock: 40,
      tags: ["microwave", "oven", "home appliance"],
      brand: "Panasonic",
      sku: "PAN-MW-5678",
      weight: 12,
      warrantyInformation: "2 years warranty",
      shippingInformation: "Ships in 5-10 business days",
      availabilityStatus: "in stock",
      returnPolicy: "7-day return policy",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      categoryId: allCategories.find((c) => c.name === "Home Appliances")!.id,
      dimensions: { width: 50.0, height: 30.0, depth: 35.0 },
      meta: { barcode: "1234567890444", qrCode: "panasonic-mw-qr" },
    },
  ];

  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        tags: p.tags,
        brand: p.brand,
        sku: p.sku,
        weight: p.weight,
        warrantyInformation: p.warrantyInformation,
        shippingInformation: p.shippingInformation,
        availabilityStatus: p.availabilityStatus,
        returnPolicy: p.returnPolicy,
        minimumOrderQuantity: p.minimumOrderQuantity,
        thumbnail: p.thumbnail,
        images: p.images,
        categoryId: p.categoryId,

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

    await prisma.productReview.createMany({
      data: allUsers.map((user, i) => ({
        rating: 4 + i * 0.5,
        comment: `Review from ${user.name} on ${product.title}`,
        date: new Date(),
        reviewerName: user.name || "Anonymous",
        reviewerEmail: user.email || "",
        productId: product.id,
        userId: user.id,
      })),
    });
  }

  console.log("✅ Seeded 3 users, 4 categories, 8 products with reviews");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
