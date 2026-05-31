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
require('dotenv').config();

// Setup the driver adapter exactly like your working old code
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Gracefully shut down the PG Connection Pool
  });