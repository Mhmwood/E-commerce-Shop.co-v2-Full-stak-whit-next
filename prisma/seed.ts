// prisma/seed.ts
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.productMeta.deleteMany();
  await prisma.productDimensions.deleteMany();
  await prisma.product.deleteMany();

  await prisma.user.deleteMany();

  // Create 5 users
  const users = await prisma.user.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@example.com",
        image: "https://example.com/avatars/john.jpg",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        image: "https://example.com/avatars/jane.jpg",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        image: "https://example.com/avatars/bob.jpg",
      },
      {
        name: "Alice Williams",
        email: "alice@example.com",
        image: "https://example.com/avatars/alice.jpg",
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        image: "https://example.com/avatars/charlie.jpg",
      },
    ],
  });

  // Create 4 categories

  // Create 20 products

  // Products data: 20 products across 4 categories
  const productsData = [
    // Electronics
    {
      title: "Smartphone X",
      description:
        "Latest smartphone with advanced camera and long battery life",
      price: 799.99,
      stock: 100,
      thumbnail: "https://example.com/products/phone.jpg",
      images: [
        "https://example.com/products/phone1.jpg",
        "https://example.com/products/phone2.jpg",
      ],
      tags: ["mobile", "electronics"],
      brand: "TechBrand",
      category: "Electronics",
      dimensions: { width: 7.5, height: 15.5, depth: 0.8 },
      meta: { barcode: "123456789012", qrCode: "SMARTPHONE_X_123" },
    },
    {
      title: "Wireless Earbuds Pro",
      description: "Noise cancelling wireless earbuds with high-fidelity sound",
      price: 149.99,
      stock: 50,
      thumbnail: "https://example.com/products/earbuds.jpg",
      images: ["https://example.com/products/earbuds1.jpg"],
      tags: ["audio", "wireless"],
      brand: "SoundMaster",
      category: "Electronics",
      dimensions: { width: 2.0, height: 2.5, depth: 2.0 },
      meta: { barcode: "234567890123", qrCode: "EARBUDS_PRO_234" },
    },
    {
      title: "Laptop Pro 15",
      description: "High-performance laptop for professionals and gamers",
      price: 1299.99,
      stock: 30,
      thumbnail: "https://example.com/products/laptop.jpg",
      images: ["https://example.com/products/laptop1.jpg"],
      tags: ["computer", "electronics"],
      brand: "ComputeMax",
      category: "Electronics",
      dimensions: { width: 35.0, height: 24.0, depth: 1.8 },
      meta: { barcode: "345678901234", qrCode: "LAPTOP_PRO_345" },
    },
    {
      title: "Smartwatch Z",
      description: "Waterproof smartwatch with fitness tracking",
      price: 199.99,
      stock: 80,
      thumbnail: "https://example.com/products/smartwatch.jpg",
      images: ["https://example.com/products/smartwatch1.jpg"],
      tags: ["wearable", "fitness"],
      brand: "WearTech",
      category: "Electronics",
      dimensions: { width: 4.0, height: 4.5, depth: 1.2 },
      meta: { barcode: "456789012345", qrCode: "SMARTWATCH_Z_456" },
    },
    {
      title: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with deep bass",
      price: 89.99,
      stock: 60,
      thumbnail: "https://example.com/products/speaker.jpg",
      images: ["https://example.com/products/speaker1.jpg"],
      tags: ["audio", "portable"],
      brand: "BeatBox",
      category: "Electronics",
      dimensions: { width: 10.0, height: 10.0, depth: 10.0 },
      meta: { barcode: "567890123456", qrCode: "SPEAKER_567" },
    },
    // Clothing
    {
      title: "Cotton T-Shirt",
      description:
        "Comfortable 100% cotton t-shirt available in multiple colors",
      price: 19.99,
      stock: 200,
      thumbnail: "https://example.com/products/tshirt.jpg",
      images: ["https://example.com/products/tshirt1.jpg"],
      tags: ["clothing", "casual"],
      brand: "FashionCo",
      category: "Clothing",
      dimensions: { width: 40.0, height: 60.0, depth: 0.5 },
      meta: { barcode: "678901234567", qrCode: "TSHIRT_678" },
    },
    {
      title: "Denim Jeans",
      description: "Stylish slim-fit denim jeans",
      price: 49.99,
      stock: 150,
      thumbnail: "https://example.com/products/jeans.jpg",
      images: ["https://example.com/products/jeans1.jpg"],
      tags: ["clothing", "denim"],
      brand: "DenimStars",
      category: "Clothing",
      dimensions: { width: 30.0, height: 100.0, depth: 1.0 },
      meta: { barcode: "789012345678", qrCode: "JEANS_789" },
    },
    {
      title: "Leather Jacket",
      description: "Genuine leather jacket for a classic look",
      price: 199.99,
      stock: 40,
      thumbnail: "https://example.com/products/jacket.jpg",
      images: ["https://example.com/products/jacket1.jpg"],
      tags: ["clothing", "leather"],
      brand: "LeatherLux",
      category: "Clothing",
      dimensions: { width: 50.0, height: 70.0, depth: 2.0 },
      meta: { barcode: "890123456789", qrCode: "JACKET_890" },
    },
    {
      title: "Running Sneakers",
      description: "Lightweight running sneakers with cushioned sole",
      price: 89.99,
      stock: 120,
      thumbnail: "https://example.com/products/sneakers.jpg",
      images: ["https://example.com/products/sneakers1.jpg"],
      tags: ["clothing", "shoes"],
      brand: "RunFast",
      category: "Clothing",
      dimensions: { width: 25.0, height: 10.0, depth: 8.0 },
      meta: { barcode: "901234567890", qrCode: "SNEAKERS_901" },
    },
    {
      title: "Summer Dress",
      description: "Light and breezy summer dress",
      price: 59.99,
      stock: 80,
      thumbnail: "https://example.com/products/dress.jpg",
      images: ["https://example.com/products/dress1.jpg"],
      tags: ["clothing", "dress"],
      brand: "StyleWear",
      category: "Clothing",
      dimensions: { width: 45.0, height: 90.0, depth: 1.0 },
      meta: { barcode: "012345678901", qrCode: "DRESS_012" },
    },
    // Home & Garden
    {
      title: "Ceramic Planter",
      description: "Beautiful ceramic plant pot for indoor plants",
      price: 29.99,
      stock: 75,
      thumbnail: "https://example.com/products/planter.jpg",
      images: ["https://example.com/products/planter1.jpg"],
      tags: ["home", "garden"],
      brand: "HomeDecor",
      category: "Home & Garden",
      dimensions: { width: 15.0, height: 20.0, depth: 15.0 },
      meta: { barcode: "112345678901", qrCode: "PLANTER_112" },
    },
    {
      title: "Throw Pillow",
      description: "Soft throw pillow with decorative cover",
      price: 24.99,
      stock: 100,
      thumbnail: "https://example.com/products/pillow.jpg",
      images: ["https://example.com/products/pillow1.jpg"],
      tags: ["home", "decor"],
      brand: "ComfortHome",
      category: "Home & Garden",
      dimensions: { width: 40.0, height: 40.0, depth: 10.0 },
      meta: { barcode: "212345678901", qrCode: "PILLOW_212" },
    },
    {
      title: "Wall Art Print",
      description: "Abstract wall art print to enhance your living space",
      price: 49.99,
      stock: 60,
      thumbnail: "https://example.com/products/wallart.jpg",
      images: ["https://example.com/products/wallart1.jpg"],
      tags: ["home", "art"],
      brand: "Artify",
      category: "Home & Garden",
      dimensions: { width: 60.0, height: 80.0, depth: 2.0 },
      meta: { barcode: "312345678901", qrCode: "WALLART_312" },
    },
    {
      title: "Coffee Table",
      description: "Wooden coffee table with modern design",
      price: 129.99,
      stock: 30,
      thumbnail: "https://example.com/products/coffeetable.jpg",
      images: ["https://example.com/products/coffeetable1.jpg"],
      tags: ["home", "furniture"],
      brand: "FurniCraft",
      category: "Home & Garden",
      dimensions: { width: 100.0, height: 45.0, depth: 50.0 },
      meta: { barcode: "412345678901", qrCode: "COFFEETABLE_412" },
    },
    {
      title: "Desk Lamp",
      description: "LED desk lamp with adjustable brightness",
      price: 39.99,
      stock: 90,
      thumbnail: "https://example.com/products/desklamp.jpg",
      images: ["https://example.com/products/desklamp1.jpg"],
      tags: ["home", "lighting"],
      brand: "BrightLight",
      category: "Home & Garden",
      dimensions: { width: 15.0, height: 50.0, depth: 15.0 },
      meta: { barcode: "512345678901", qrCode: "DESKLAMP_512" },
    },
    // Sports
    {
      title: "Yoga Mat",
      description: "Non-slip premium yoga mat",
      price: 39.99,
      stock: 60,
      thumbnail: "https://example.com/products/yogamat.jpg",
      images: ["https://example.com/products/yogamat1.jpg"],
      tags: ["fitness", "yoga"],
      brand: "FitLife",
      category: "Sports",
      dimensions: { width: 60.0, height: 0.5, depth: 180.0 },
      meta: { barcode: "612345678901", qrCode: "YOGAMAT_612" },
    },
    {
      title: "Running Shoes",
      description: "Lightweight running shoes with cushioned sole",
      price: 89.99,
      stock: 120,
      thumbnail: "https://example.com/products/runningshoes.jpg",
      images: ["https://example.com/products/runningshoes1.jpg"],
      tags: ["fitness", "shoes"],
      brand: "RunFast",
      category: "Sports",
      dimensions: { width: 25.0, height: 10.0, depth: 8.0 },
      meta: { barcode: "712345678901", qrCode: "RUNNINGSHOES_712" },
    },
    {
      title: "Dumbbell Set",
      description: "Adjustable dumbbell set for home workouts",
      price: 59.99,
      stock: 40,
      thumbnail: "https://example.com/products/dumbbell.jpg",
      images: ["https://example.com/products/dumbbell1.jpg"],
      tags: ["fitness", "equipment"],
      brand: "StrongFit",
      category: "Sports",
      dimensions: { width: 20.0, height: 20.0, depth: 20.0 },
      meta: { barcode: "812345678901", qrCode: "DUMBBELL_812" },
    },
    {
      title: "Fitness Tracker",
      description: "Wearable fitness tracker with heart rate monitor",
      price: 129.99,
      stock: 70,
      thumbnail: "https://example.com/products/fitnesstracker.jpg",
      images: ["https://example.com/products/fitnesstracker1.jpg"],
      tags: ["fitness", "wearable"],
      brand: "HealthTech",
      category: "Sports",
      dimensions: { width: 3.0, height: 4.0, depth: 1.0 },
      meta: { barcode: "912345678901", qrCode: "TRACKER_912" },
    },
    {
      title: "Basketball",
      description: "Official size basketball with durable cover",
      price: 29.99,
      stock: 80,
      thumbnail: "https://example.com/products/basketball.jpg",
      images: ["https://example.com/products/basketball1.jpg"],
      tags: ["sports", "ball"],
      brand: "SportPro",
      category: "Sports",
      dimensions: { width: 24.0, height: 24.0, depth: 24.0 },
      meta: { barcode: "101234567890", qrCode: "BASKETBALL_101" },
    },
  ];

  // Create products
  const products = [];
  for (const p of productsData) {
    const prod = await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,

        stock: p.stock,
        thumbnail: p.thumbnail,
        images: p.images ?? [],
        tags: p.tags ?? [],
        brand: p.brand,

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
    products.push(prod);
  }
  // Create cart items for users
  const user1 = await prisma.user.findFirst({
    where: { email: "john@example.com" },
  });
  const user2 = await prisma.user.findFirst({
    where: { email: "jane@example.com" },
  });

  if (user1 && user2) {
    // Add products to user carts
    await prisma.cartItem.createMany({
      data: [
        { userId: user1.id, productId: products[0].id, quantity: 2 },
        { userId: user1.id, productId: products[2].id, quantity: 1 },
        { userId: user2.id, productId: products[1].id, quantity: 3 },
      ],
    });

    // Create orders
    const order1 = await prisma.order.create({
      data: {
        userId: user1.id,
        totalAmount: 799.99 * 2 + 19.99,
        status: OrderStatus.PAID,
        shippingAddress: "123 Main St, Anytown, USA",
        paymentMethod: "Credit Card",
        orderItems: {
          create: [
            { productId: products[0].id, quantity: 2, price: 799.99 },
            { productId: products[2].id, quantity: 1, price: 19.99 },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        userId: user2.id,
        totalAmount: 149.99 * 3,
        status: OrderStatus.SHIPPED,
        shippingAddress: "456 Oak Ave, Somewhere, USA",
        paymentMethod: "PayPal",
        orderItems: {
          create: [{ productId: products[1].id, quantity: 3, price: 149.99 }],
        },
      },
    });
  }

  // Create some product reviews
  await prisma.productReview.createMany({
    data: [
      {
        productId: products[0].id,
        userId: user1?.id || "",
        rating: 4.5,
        comment: "Great phone!",
        reviewerName: "John Doe",
        reviewerEmail: "john@example.com",
        date: new Date(),
      },
      // ... add more reviews
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
