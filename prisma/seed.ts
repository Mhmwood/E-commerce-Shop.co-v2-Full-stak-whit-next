import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // حذف البيانات القديمة
  await prisma.productReview.deleteMany();
  await prisma.productMeta.deleteMany();
  await prisma.productDimensions.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // إنشاء المستخدم التجريبي
  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      image: "https://i.pravatar.cc/300",
    },
  });

  // إنشاء الفئات (categories)
  const categoriesData = ["Electronics", "Clothing", "Home & Garden", "Sports"];

  const categories = {};
  for (const name of categoriesData) {
    const category = await prisma.category.create({ data: { name } });
    categories[name] = category;
  }

  // إنشاء المنتجات وربطها بالفئات
  const macbook = await prisma.product.create({
    data: {
      title: 'MacBook Pro 16"',
      description:
        "High-performance laptop for developers and designers with M2 Pro chip.",
      price: 2499.99,
      discountPercentage: 5,
      rating: 4.9,
      stock: 20,
      tags: ["apple", "macbook", "laptop", "computer"],
      brand: "Apple",
      sku: "MBP-16-2024",
      weight: 2.1,
      warrantyInformation: "1 year global AppleCare warranty.",
      shippingInformation: "Ships within 3 business days.",
      availabilityStatus: "in stock",
      returnPolicy: "15-day return period",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      category: { connect: { id: categories["Electronics"].id } },
    },
  });

  const iphone = await prisma.product.create({
    data: {
      title: "iPhone 15 Pro",
      description:
        "Latest iPhone with titanium design and advanced camera system.",
      price: 999.99,
      discountPercentage: 0,
      rating: 4.8,
      stock: 50,
      tags: ["apple", "iphone", "smartphone", "mobile"],
      brand: "Apple",
      sku: "IPH-15-PRO",
      weight: 0.187,
      warrantyInformation: "1 year limited warranty.",
      shippingInformation: "Ships within 2 business days.",
      availabilityStatus: "in stock",
      returnPolicy: "14-day return period",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      category: { connect: { id: categories["Electronics"].id } },
    },
  });

  const tshirt = await prisma.product.create({
    data: {
      title: "Premium Cotton T-Shirt",
      description: "Comfortable 100% organic cotton t-shirt with modern fit.",
      price: 29.99,
      discountPercentage: 15,
      rating: 4.5,
      stock: 100,
      tags: ["cotton", "tshirt", "casual", "comfortable"],
      brand: "FashionCo",
      sku: "TSH-COT-001",
      weight: 0.2,
      warrantyInformation: "30-day return policy.",
      shippingInformation: "Ships within 1 business day.",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return period",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      category: { connect: { id: categories["Clothing"].id } },
    },
  });

  const jeans = await prisma.product.create({
    data: {
      title: "Slim Fit Jeans",
      description: "Modern slim fit jeans with stretch technology for comfort.",
      price: 79.99,
      discountPercentage: 20,
      rating: 4.3,
      stock: 75,
      tags: ["jeans", "denim", "slim-fit", "casual"],
      brand: "DenimStyle",
      sku: "JEA-SLF-002",
      weight: 0.5,
      warrantyInformation: "30-day return policy.",
      shippingInformation: "Ships within 2 business days.",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return period",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      category: { connect: { id: categories["Clothing"].id } },
    },
  });

  const coffeeMaker = await prisma.product.create({
    data: {
      title: "Programmable Coffee Maker",
      description: "12-cup programmable coffee maker with auto-brew feature.",
      price: 89.99,
      discountPercentage: 10,
      rating: 4.6,
      stock: 30,
      tags: ["coffee", "appliance", "kitchen", "programmable"],
      brand: "BrewMaster",
      sku: "COF-MKR-003",
      weight: 3.2,
      warrantyInformation: "2 year limited warranty.",
      shippingInformation: "Ships within 3 business days.",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return period",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      category: { connect: { id: categories["Home & Garden"].id } },
    },
  });

  const gardenTool = await prisma.product.create({
    data: {
      title: "Professional Garden Tool Set",
      description:
        "Complete garden tool set with ergonomic handles and storage case.",
      price: 149.99,
      discountPercentage: 25,
      rating: 4.7,
      stock: 25,
      tags: ["garden", "tools", "outdoor", "professional"],
      brand: "GardenPro",
      sku: "GRD-TLS-004",
      weight: 2.8,
      warrantyInformation: "1 year warranty on tools.",
      shippingInformation: "Ships within 4 business days.",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return period",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      category: { connect: { id: categories["Home & Garden"].id } },
    },
  });

  const basketball = await prisma.product.create({
    data: {
      title: "Professional Basketball",
      description:
        "Official size basketball with premium leather construction.",
      price: 59.99,
      discountPercentage: 0,
      rating: 4.4,
      stock: 60,
      tags: ["basketball", "sports", "leather", "professional"],
      brand: "SportPro",
      sku: "SPT-BSK-005",
      weight: 0.6,
      warrantyInformation: "90-day warranty.",
      shippingInformation: "Ships within 2 business days.",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return period",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      category: { connect: { id: categories["Sports"].id } },
    },
  });

  const yogaMat = await prisma.product.create({
    data: {
      title: "Premium Yoga Mat",
      description: "Non-slip yoga mat with extra cushioning for comfort.",
      price: 39.99,
      discountPercentage: 15,
      rating: 4.8,
      stock: 80,
      tags: ["yoga", "fitness", "mat", "non-slip"],
      brand: "YogaLife",
      sku: "SPT-YGA-006",
      weight: 1.2,
      warrantyInformation: "1 year warranty.",
      shippingInformation: "Ships within 1 business day.",
      availabilityStatus: "in stock",
      returnPolicy: "30-day return period",
      minimumOrderQuantity: 1,
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      ],
      category: { connect: { id: categories["Sports"].id } },
    },
  });

  // أضف الأبعاد والبيانات الوصفية والتقييمات لكل منتج
  const products = [
    macbook,
    iphone,
    tshirt,
    jeans,
    coffeeMaker,
    gardenTool,
    basketball,
    yogaMat,
  ];

  for (const product of products) {
    await prisma.productDimensions.create({
      data: {
        width: Math.random() * 50 + 10,
        height: Math.random() * 30 + 5,
        depth: Math.random() * 20 + 1,
        productId: product.id,
      },
    });

    await prisma.productMeta.create({
      data: {
        barcode: `1234567890${product.id}`,
        qrCode: `product-${product.id}-qr`,
        productId: product.id,
      },
    });

    await prisma.productReview.createMany({
      data: [
        {
          rating: Math.floor(Math.random() * 2) + 4,
          comment: "Great product, highly recommended!",
          date: new Date(),
          reviewerName: "Happy Customer",
          reviewerEmail: "customer@example.com",
          productId: product.id,
          userId: user.id,
        },
        {
          rating: Math.floor(Math.random() * 2) + 3,
          comment: "Good quality, meets expectations.",
          date: new Date(),
          reviewerName: "Satisfied User",
          reviewerEmail: "user@example.com",
          productId: product.id,
          userId: user.id,
        },
      ],
    });
  }

  console.log("✅ Seeded with 8 products across 4 categories:");
  console.log("- Electronics: MacBook Pro, iPhone 15 Pro");
  console.log("- Clothing: Premium T-Shirt, Slim Fit Jeans");
  console.log("- Home & Garden: Coffee Maker, Garden Tool Set");
  console.log("- Sports: Basketball, Yoga Mat");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
