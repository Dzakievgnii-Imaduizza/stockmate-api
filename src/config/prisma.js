const { PrismaClient } = require('../generated/client/client'); // Path to your generated folder
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

// Create the connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Setup the Prisma 7 Adapter
const adapter = new PrismaPg(pool);

// Initialize the Client with the adapter
const prisma = new PrismaClient({ adapter });

// Export the single instance
module.exports = prisma;