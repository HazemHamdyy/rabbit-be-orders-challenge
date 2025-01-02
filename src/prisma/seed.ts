import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const productsCount = 70000;
  const categoryCount = 50; // MAKE 50 CATEGORIES FOR TEST
  const ordersCount = 10000;
  const maxOrderItems = 10;

  // Step 1: Seed Products
  const products: { name: string; categoryId: number; areaId: number }[] = [];
  const categories: { name: string }[] = [];

  // NEW AREAS LIST WITH SAME REGIONS (maadi, new_cairo, zayed, giza)
  const areas = [
    {
      name: 'maadi',
      boundary: [
        [
          [31.2155, 29.9497],
          [31.2183, 29.9497],
          [31.2183, 29.9476],
          [31.2173, 29.9455],
          [31.2155, 29.9455],
          [31.2155, 29.9497],
        ],
      ],
    },
    {
      name: 'new_cairo',
      boundary: [
        [
          [31.5132, 30.0262],
          [31.5184, 30.0314],
          [31.5223, 30.0352],
          [31.5297, 30.0355],
          [31.5338, 30.0298],
          [31.5382, 30.0298],
          [31.5401, 30.0229],
          [31.5357, 30.0184],
          [31.5284, 30.0172],
          [31.5236, 30.0155],
          [31.5143, 30.0162],
          [31.5132, 30.0262],
        ],
      ],
    },
    {
      name: 'zayed',
      boundary: [
        [
          [31.007, 30.0265],
          [31.0105, 30.027],
          [31.0155, 30.025],
          [31.02, 30.02],
          [31.0155, 30.0155],
          [31.01, 30.0155],
          [31.007, 30.0165],
          [31.007, 30.0265],
        ],
      ],
    },
    {
      name: 'giza',
      boundary: [
        [
          [31.197, 30.031],
          [31.1995, 30.036],
          [31.205, 30.037],
          [31.209, 30.035],
          [31.2125, 30.0305],
          [31.211, 30.027],
          [31.2065, 30.0245],
          [31.201, 30.025],
          [31.197, 30.031],
        ],
      ],
    },
  ];

  console.log('Seeding Areas...');
  await prisma.area.createMany({
    data: areas,
  });
  const storesAreas = await prisma.area.findMany();

  // const areas = ['Maadi', 'Zayed', 'New Cairo', 'Giza'];

  // CREATE CATEGORIES
  for (let i = 0; i < categoryCount; i++) {
    categories.push({
      name: `category ${i + 1}`,
    });
  }

  console.log('Seeding Categories...');
  await prisma.category.createMany({
    data: categories,
  });

  const storedCategories = await prisma.category.findMany();

  // CREATE PRODUCTS
  for (let i = 0; i < productsCount; i++) {
    // GET RANDOM AREA AND RANDOM CATEGORY FOR PRODUCT
    const randomAreaId = Math.floor(Math.random() * storesAreas.length) + 1;
    const randomCategoryId: number =
      storedCategories[Math.floor(Math.random() * storedCategories.length)].id;
    products.push({
      name: `Product ${i + 1}`,
      categoryId: randomCategoryId,
      areaId: randomAreaId,
    });
  }

  console.log('Seeding Products...');
  await prisma.product.createMany({ data: products });

  // Step 2: Seed Orders and Order Items
  const allProducts = await prisma.product.findMany({ select: { id: true } });
  const productIds = allProducts.map((product) => product.id);

  console.log('Seeding Orders and Order Items...');
  for (let i = 0; i < ordersCount; i++) {
    const randomAreaId = Math.floor(Math.random() * storesAreas.length) + 1;
    const order = await prisma.order.create({
      data: {
        customerId: Math.floor(Math.random() * 1000),
        areaId: randomAreaId,
      },
    });

    const orderItems = [];
    const itemsCount = Math.floor(Math.random() * maxOrderItems) + 1;

    for (let j = 0; j < itemsCount; j++) {
      const randomProductId =
        productIds[Math.floor(Math.random() * productIds.length)];
      orderItems.push({
        productId: randomProductId,
        quantity: Math.floor(Math.random() * 5) + 1,
        orderId: order.id,
      });
    }
    try {
      await prisma.orderItem.createMany({ data: orderItems });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // DURING CREATE ORDER ITEM FIELD orderId, productId UNIQUE CONSTRAINT VIOLATED
      console.warn('unique constraint violated during random creation');
    }
  }
  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
