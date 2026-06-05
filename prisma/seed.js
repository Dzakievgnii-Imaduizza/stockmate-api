<<<<<<< Updated upstream
// const { PrismaClient } = require('../src/generated/client/client');
// const { PrismaPg } = require('@prisma/adapter-pg');
// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   console.log('🌱 Seeding StockMate database...');

//   // Using nested write to create Store and User (Owner) together
//   // This ensures the foreign keys are linked correctly from the start.
//   const newStore = await prisma.store.create({
//     data: {
//       name: 'StockMate Headquarters',
//       address: '456 Innovation Drive',
//       owner_id: 'initial-owner-id', // Placeholder, or use a specific UUID
//       users: {
//         create: [
//           {
//             name: 'The Boss',
//             email: 'boss@stockmate.com',
//             password_hash: '$2b$10$HNGRsigfUwjonteu9pyYL.0pAoqFT0VmvUo3KF7I.rb.c3S7BmYuS', // Use bcrypt to hash in real apps
//             role: 'ADMIN',
//           },
//         ],
//       },
//       categories: {
//         create: [
//           { name: 'General Supplies' },
//           { name: 'Office Equipment' }
//         ]
//       }
//     },
//     include: {
//       users: true,
//     },
//   });

//   // Since Store.owner_id is a plain field in your schema, we update it 
//   // with the ID of the user we just created.
//   await prisma.store.update({
//     where: { id: newStore.id },
//     data: { owner_id: newStore.users[0].id }
//   });

//   console.log(`✅ Seeded Store: ${newStore.name}`);
//   console.log(`👤 Created Admin User: ${newStore.users[0].email}`);
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seeding failed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//     await pool.end();
//   });
const { PrismaClient } = require('../src/generated/client/client'); // Fixed import path
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
=======
const { randomUUID } = require('crypto');
const { PrismaClient } = require('../src/generated/client/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
>>>>>>> Stashed changes
require('dotenv').config();

// Setup the driver adapter exactly like your working old code
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

<<<<<<< Updated upstream
async function main() {
  console.log('🌱 Starting database seeding with PG Adapter...');

  // 1. Clean existing data (Order matters due to Foreign Key constraints)
  await prisma.reviews.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.stockRule.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();

  console.log('🧹 Cleaned existing data.');

  // Helper function using your exact encryption method
  const hashPassword = async (rawPassword) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(rawPassword, salt);
  };

  const ownerPasswordHash = await hashPassword('ownerSecurePassword123');
  const staffPasswordHash = await hashPassword('staffSecurePassword123');

  // 2. Create Store & Owner together using a nested write
  const newStore = await prisma.store.create({
    data: {
      name: 'StockMate Headquarters',
      address: '456 Innovation Drive',
      owner_id: 'initial-owner-id', // Placeholder, updated right below
      users: {
        create: [
          {
            name: 'The Boss',
            email: 'stockmate51@gmail.com',
            password_hash: ownerPasswordHash,
            role: 'admin', // Full lowercase matching custom data
          },
        ],
      },
      categories: {
        create: [
          { name: 'Electronics' },
          { name: 'Groceries' }
        ]
      }
    },
    include: {
      users: true,
      categories: true
    },
  });

  const owner = newStore.users[0];
  const categoryElectronics = newStore.categories.find(c => c.name === 'Electronics');
  const categoryGroceries = newStore.categories.find(c => c.name === 'Groceries');

  // 3. Update Store's owner_id with the real created User ID
  await prisma.store.update({
    where: { id: newStore.id },
    data: { owner_id: owner.id }
  });

  // 4. Create Staff Accounts linked to the same store
  const staff1 = await prisma.user.create({
    data: {
      name: 'Alice Smith',
      email: 'alice@stockmate.com',
      password_hash: staffPasswordHash,
      role: 'staff',
      store_id: newStore.id,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      name: 'Bob Johnson',
      email: 'bob@stockmate.com',
      password_hash: staffPasswordHash,
      role: 'staff',
      store_id: newStore.id,
    },
  });

  // 5. Create Supplier
  const supplier = await prisma.supplier.create({
    data: {
      name: 'Global Logistics Corp',
      phone: '+15550199',
      address: '456 Supply Chain Way',
      latitude: 37.7749,
      longitude: -122.4194,
      store_id: newStore.id,
    },
  });

  // 6. Create Reviews for the Supplier (Calculates rating out of it)
  const reviewData = [
    { supplier_id: supplier.id, user_id: owner.id, star: 5, review: 'Excellent response times!' },
    { supplier_id: supplier.id, user_id: staff1.id, star: 4, review: 'Good packaging, slightly delayed.' },
    { supplier_id: supplier.id, user_id: staff2.id, star: 3, review: 'Average experience.' },
  ];

  for (const review of reviewData) {
    await prisma.reviews.create({ data: review });
  }

  // Update Supplier Average Rating based on reviews
  const avgRating = reviewData.reduce((acc, r) => acc + r.star, 0) / reviewData.length;
  await prisma.supplier.update({
    where: { id: supplier.id },
    data: { rating: avgRating },
  });

  // 7. Create Products
  const productLaptop = await prisma.product.create({
    data: {
      name: 'Pro Laptop 15"',
      buy_price: 800.0,
      sell_price: 1200.0,
      stock_qty: 45, 
      min_stock: 5,
      unit: 'pcs',
      store_id: newStore.id,
      category_id: categoryElectronics.id,
      supplier_id: supplier.id,
    },
  });

  const productApple = await prisma.product.create({
    data: {
      name: 'Organic Apples',
      buy_price: 1.5,
      sell_price: 3.0,
      stock_qty: 120, 
      min_stock: 20,
      unit: 'kg',
      store_id: newStore.id,
      category_id: categoryGroceries.id,
      supplier_id: supplier.id,
    },
  });

  // 8. Generate Varied Time-Series Transactions over the last 14 days
  console.log('⏳ Simulating 14 days of time-series transactions...');
  const products = [productLaptop, productApple];
  const users = [owner, staff1, staff2];
  const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  for (let i = 14; i >= 0; i--) {
    const transactionDate = new Date();
    transactionDate.setDate(transactionDate.getDate() - i);

    for (const prod of products) {
      const isOut = Math.random() > 0.3; // 70% OUT events, 30% IN events
      const qty = isOut ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 15) + 5;
      const type = isOut ? 'OUT' : 'IN'; // Enforced full uppercase
      const trans_price = type === 'OUT' ? prod.sell_price : prod.buy_price;

      await prisma.transaction.create({
        data: {
          product_id: prod.id,
          user_id: randomElement(users).id,
          type: type,
          qty: qty,
          trans_price: trans_price,
          note: type === 'OUT' ? 'Customer Purchase' : 'Restock Delivery',
          created_at: transactionDate,
        },
      });
    }
  }

  // 9. Run Stockout Prediction Formula mapping your exact parameters
  console.log('🤖 Running stockout prediction algorithms...');
  await calculateAndApplyStockout(productLaptop.id);
  await calculateAndApplyStockout(productApple.id);

  console.log('✅ Seeding completed successfully!');
}

/**
 * Formula implementation matching your specific business logic
 */
async function calculateAndApplyStockout(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return null;

  let predictedStockoutDate = null;

  if (product.stock_qty > 0) {
    const daysWindow = 14;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - daysWindow);

    const salesAggregate = await prisma.transaction.aggregate({
      where: {
        product_id: productId,
        type: 'OUT',
        created_at: { gte: dateLimit },
      },
      _sum: { qty: true },
    });

    const totalSales = salesAggregate._sum.qty || 0;

    if (totalSales > 0) {
      const dailySalesRate = totalSales / daysWindow;
      const daysUntilStockout = product.stock_qty / dailySalesRate;

      const etaDate = new Date();
      etaDate.setDate(etaDate.getDate() + daysUntilStockout);
      predictedStockoutDate = etaDate;
    }
  } else {
    predictedStockoutDate = new Date();
  }

  return await prisma.product.update({
    where: { id: productId },
    data: {
      predicted_stockout: predictedStockoutDate,
    },
  });
=======
async function ensureCategories(storeId, categoryNames) {
  const existingCategories = await prisma.category.findMany({
    where: { store_id: storeId },
    select: { name: true },
  });

  const existingCategoryNames = new Set(existingCategories.map((category) => category.name));
  const missingCategoryNames = categoryNames.filter((name) => !existingCategoryNames.has(name));

  if (missingCategoryNames.length === 0) {
    return;
  }

  await prisma.category.createMany({
    data: missingCategoryNames.map((name) => ({
      name,
      store_id: storeId,
    })),
  });
}

async function getCategoryMap(storeId) {
  const categories = await prisma.category.findMany({
    where: { store_id: storeId },
  });

  return new Map(categories.map((category) => [category.name, category]));
}

async function ensureSuppliers(storeId, supplierData) {
  const supplierMap = new Map();

  for (const data of supplierData) {
    const existingSupplier = await prisma.supplier.findFirst({
      where: { store_id: storeId, name: data.name },
    });

    const supplier = existingSupplier
      ? await prisma.supplier.update({
          where: { id: existingSupplier.id },
          data: { ...data, store_id: storeId },
        })
      : await prisma.supplier.create({
          data: { ...data, store_id: storeId },
        });

    supplierMap.set(supplier.name, supplier);
  }

  return supplierMap;
}

async function ensureProducts(storeId, categoryMap, productData) {
  const productMap = new Map();

  for (const item of productData) {
    const category = categoryMap.get(item.categoryName);

    if (!category) {
      throw new Error(`Category not found for product seed: ${item.categoryName}`);
    }

    const data = {
      name: item.name,
      category_id: category.id,
      buy_price: item.buy_price,
      sell_price: item.sell_price,
      stock_qty: item.stock_qty,
      min_stock: item.min_stock,
      unit: item.unit,
      predicted_stockout: item.predicted_stockout || null,
      store_id: storeId,
    };

    const existingProduct = await prisma.product.findFirst({
      where: { store_id: storeId, name: item.name },
    });

    const product = existingProduct
      ? await prisma.product.update({
          where: { id: existingProduct.id },
          data,
        })
      : await prisma.product.create({ data });

    productMap.set(product.name, product);
  }

  return productMap;
}

async function ensureStockRules(storeId, productMap, stockRuleData) {
  for (const item of stockRuleData) {
    const product = productMap.get(item.productName);

    if (!product) {
      throw new Error(`Product not found for stock rule seed: ${item.productName}`);
    }

    await prisma.stockRule.upsert({
      where: { product_id: product.id },
      update: {
        min_threshold: item.min_threshold,
        restock_suggestion: item.restock_suggestion,
        store_id: storeId,
      },
      create: {
        product_id: product.id,
        store_id: storeId,
        min_threshold: item.min_threshold,
        restock_suggestion: item.restock_suggestion,
      },
    });
  }
}

async function ensureTransactions(userId, productMap, transactionData) {
  for (const item of transactionData) {
    const product = productMap.get(item.productName);

    if (!product) {
      throw new Error(`Product not found for transaction seed: ${item.productName}`);
    }

    const data = {
      product_id: product.id,
      user_id: userId,
      type: item.type,
      qty: item.qty,
      note: item.note,
      trans_price: item.trans_price,
      created_at: item.created_at,
    };

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        product_id: product.id,
        user_id: userId,
        type: item.type,
        note: item.note,
      },
    });

    if (existingTransaction) {
      await prisma.transaction.update({
        where: { id: existingTransaction.id },
        data,
      });
    } else {
      await prisma.transaction.create({ data });
    }
  }
}

async function ensureNotifications(userId, productMap, notificationData) {
  for (const item of notificationData) {
    const product = productMap.get(item.productName);

    if (!product) {
      throw new Error(`Product not found for notification seed: ${item.productName}`);
    }

    const data = {
      user_id: userId,
      product_id: product.id,
      message: item.message,
      is_read: item.is_read,
    };

    const existingNotification = await prisma.notification.findFirst({
      where: {
        user_id: userId,
        product_id: product.id,
        message: item.message,
      },
    });

    if (existingNotification) {
      await prisma.notification.update({
        where: { id: existingNotification.id },
        data,
      });
    } else {
      await prisma.notification.create({ data });
    }
  }
}

async function ensureReviews(userId, supplierMap, reviewData) {
  for (const item of reviewData) {
    const supplier = supplierMap.get(item.supplierName);

    if (!supplier) {
      throw new Error(`Supplier not found for review seed: ${item.supplierName}`);
    }

    const data = {
      user_id: userId,
      supplier_id: supplier.id,
      star: item.star,
      review: item.review,
    };

    const existingReview = await prisma.reviews.findFirst({
      where: {
        user_id: userId,
        supplier_id: supplier.id,
      },
    });

    if (existingReview) {
      await prisma.reviews.update({
        where: { id: existingReview.id },
        data,
      });
    } else {
      await prisma.reviews.create({ data });
    }
  }
}

async function refreshSupplierRatings(supplierMap) {
  for (const supplier of supplierMap.values()) {
    const aggregate = await prisma.reviews.aggregate({
      where: { supplier_id: supplier.id },
      _avg: { star: true },
    });

    await prisma.supplier.update({
      where: { id: supplier.id },
      data: { rating: aggregate._avg.star || null },
    });
  }
}

async function main() {
  const storeName = 'StockMate Headquarters';
  const storeAddress = '456 Innovation Drive';
  const adminName = 'The Boss';
  const adminRole = 'admin';
  const staffName = 'StockMate Staff';
  const staffRole = 'staff';
  const categoryNames = ['General Supplies', 'Office Equipment'];
  const supplierData = [
    {
      name: 'PT Sumber Alat Tulis',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 12, Jakarta',
      latitude: -6.2001,
      longitude: 106.8166,
      rating: 4.5,
    },
    {
      name: 'CV Teknologi Nusantara',
      phone: '082112223333',
      address: 'Jl. Sudirman No. 45, Bandung',
      latitude: -6.9175,
      longitude: 107.6191,
      rating: 4,
    },
  ];
  const productData = [
    {
      name: 'Pulpen Pilot G2',
      categoryName: 'General Supplies',
      buy_price: 8000,
      sell_price: 12000,
      stock_qty: 50,
      min_stock: 10,
      unit: 'pcs',
    },
    {
      name: 'Kertas A4 80gsm',
      categoryName: 'General Supplies',
      buy_price: 45000,
      sell_price: 58000,
      stock_qty: 18,
      min_stock: 20,
      unit: 'rim',
      predicted_stockout: new Date('2026-06-10T00:00:00.000Z'),
    },
    {
      name: 'Keyboard Mechanical',
      categoryName: 'Office Equipment',
      buy_price: 275000,
      sell_price: 350000,
      stock_qty: 8,
      min_stock: 5,
      unit: 'unit',
    },
    {
      name: 'Mouse Wireless',
      categoryName: 'Office Equipment',
      buy_price: 95000,
      sell_price: 135000,
      stock_qty: 4,
      min_stock: 8,
      unit: 'unit',
      predicted_stockout: new Date('2026-06-03T00:00:00.000Z'),
    },
  ];
  const stockRuleData = [
    { productName: 'Pulpen Pilot G2', min_threshold: 10, restock_suggestion: 100 },
    { productName: 'Kertas A4 80gsm', min_threshold: 20, restock_suggestion: 50 },
    { productName: 'Keyboard Mechanical', min_threshold: 5, restock_suggestion: 15 },
    { productName: 'Mouse Wireless', min_threshold: 8, restock_suggestion: 25 },
  ];
  const transactionData = [
    {
      productName: 'Pulpen Pilot G2',
      type: 'IN',
      qty: 80,
      note: 'Seed initial stock - pulpen',
      trans_price: 8000,
      created_at: new Date('2026-05-20T03:00:00.000Z'),
    },
    {
      productName: 'Pulpen Pilot G2',
      type: 'OUT',
      qty: 30,
      note: 'Seed office usage - pulpen',
      trans_price: 12000,
      created_at: new Date('2026-05-24T06:30:00.000Z'),
    },
    {
      productName: 'Kertas A4 80gsm',
      type: 'OUT',
      qty: 12,
      note: 'Seed monthly document printing',
      trans_price: 58000,
      created_at: new Date('2026-05-25T09:00:00.000Z'),
    },
    {
      productName: 'Mouse Wireless',
      type: 'OUT',
      qty: 6,
      note: 'Seed equipment replacement',
      trans_price: 135000,
      created_at: new Date('2026-05-26T04:15:00.000Z'),
    },
  ];
  const notificationData = [
    {
      productName: 'Kertas A4 80gsm',
      message: 'Stok Kertas A4 80gsm sudah di bawah minimum. Segera restock 50 rim.',
      is_read: false,
    },
    {
      productName: 'Mouse Wireless',
      message: 'Stok Mouse Wireless kritis. Rekomendasi restock 25 unit.',
      is_read: false,
    },
    {
      productName: 'Keyboard Mechanical',
      message: 'Stok Keyboard Mechanical masih aman.',
      is_read: true,
    },
  ];
  const reviewData = [
    {
      supplierName: 'PT Sumber Alat Tulis',
      star: 5,
      review: 'Pengiriman cepat dan kualitas barang sesuai pesanan.',
    },
    {
      supplierName: 'CV Teknologi Nusantara',
      star: 4,
      review: 'Produk lengkap, respon supplier cukup cepat.',
    },
  ];
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'boss@stockmate.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const staffEmail = process.env.SEED_STAFF_EMAIL || 'staff@stockmate.com';
  const staffPassword = process.env.SEED_STAFF_PASSWORD || 'staff123';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const staffPasswordHash = await bcrypt.hash(staffPassword, 10);

  if (staffEmail === adminEmail) {
    throw new Error('SEED_STAFF_EMAIL must be different from SEED_ADMIN_EMAIL');
  }

  console.log('Seeding StockMate database...');

  let store = await prisma.store.findFirst({
    where: {
      OR: [
        { users: { some: { email: adminEmail } } },
        { name: storeName },
      ],
    },
    include: {
      users: {
        where: { email: adminEmail },
      },
    },
  });

  if (!store) {
    store = await prisma.store.create({
      data: {
        name: storeName,
        address: storeAddress,
        owner_id: randomUUID(),
      },
      include: {
        users: {
          where: { email: adminEmail },
        },
      },
    });
  } else {
    store = await prisma.store.update({
      where: { id: store.id },
      data: {
        name: storeName,
        address: storeAddress,
      },
      include: {
        users: {
          where: { email: adminEmail },
        },
      },
    });
  }

  let adminUser = store.users[0];

  if (!adminUser) {
    adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: adminName,
        password_hash: adminPasswordHash,
        role: adminRole,
        store_id: store.id,
      },
      create: {
        name: adminName,
        email: adminEmail,
        password_hash: adminPasswordHash,
        role: adminRole,
        store_id: store.id,
      },
    });
  } else {
    adminUser = await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        name: adminName,
        password_hash: adminPasswordHash,
        role: adminRole,
        store_id: store.id,
      },
    });
  }

  if (store.owner_id !== adminUser.id) {
    store = await prisma.store.update({
      where: { id: store.id },
      data: { owner_id: adminUser.id },
    });
  }

  const staffUser = await prisma.user.upsert({
    where: { email: staffEmail },
    update: {
      name: staffName,
      password_hash: staffPasswordHash,
      role: staffRole,
      store_id: store.id,
    },
    create: {
      name: staffName,
      email: staffEmail,
      password_hash: staffPasswordHash,
      role: staffRole,
      store_id: store.id,
    },
  });

  await ensureCategories(store.id, categoryNames);
  const categoryMap = await getCategoryMap(store.id);
  const supplierMap = await ensureSuppliers(store.id, supplierData);
  const productMap = await ensureProducts(store.id, categoryMap, productData);

  await ensureStockRules(store.id, productMap, stockRuleData);
  await ensureTransactions(adminUser.id, productMap, transactionData);
  await ensureNotifications(adminUser.id, productMap, notificationData);
  await ensureReviews(staffUser.id, supplierMap, reviewData);
  await refreshSupplierRatings(supplierMap);

  console.log(`Seeded Store: ${store.name}`);
  console.log(`Admin User Ready: ${adminUser.email}`);
  console.log(`Admin Password: ${adminPassword}`);
  console.log(`Staff User Ready: ${staffUser.email}`);
  console.log(`Staff Password: ${staffPassword}`);
  console.log(`Seeded Categories: ${categoryMap.size}`);
  console.log(`Seeded Suppliers: ${supplierMap.size}`);
  console.log(`Seeded Products: ${productMap.size}`);
  console.log(`Seeded Stock Rules: ${stockRuleData.length}`);
  console.log(`Seeded Transactions: ${transactionData.length}`);
  console.log(`Seeded Notifications: ${notificationData.length}`);
  console.log(`Seeded Reviews: ${reviewData.length}`);
>>>>>>> Stashed changes
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
<<<<<<< Updated upstream
    await pool.end(); // Gracefully shut down the PG Connection Pool
  });
=======
    await pool.end();
  });
>>>>>>> Stashed changes
