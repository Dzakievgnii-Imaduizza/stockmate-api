const { PrismaClient } = require('../src/generated/client/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding StockMate database...');

  // Using nested write to create Store and User (Owner) together
  // This ensures the foreign keys are linked correctly from the start.
  const newStore = await prisma.store.create({
    data: {
      name: 'StockMate Headquarters',
      address: '456 Innovation Drive',
      owner_id: 'initial-owner-id', // Placeholder, or use a specific UUID
      users: {
        create: [
          {
            name: 'The Boss',
            email: 'boss@stockmate.com',
            password_hash: 'top-secret-hash', // Use bcrypt to hash in real apps
            role: 'ADMIN',
          },
        ],
      },
      categories: {
        create: [
          { name: 'General Supplies' },
          { name: 'Office Equipment' }
        ]
      }
    },
    include: {
      users: true,
    },
  });

  // Since Store.owner_id is a plain field in your schema, we update it 
  // with the ID of the user we just created.
  await prisma.store.update({
    where: { id: newStore.id },
    data: { owner_id: newStore.users[0].id }
  });

  console.log(`✅ Seeded Store: ${newStore.name}`);
  console.log(`👤 Created Admin User: ${newStore.users[0].email}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });