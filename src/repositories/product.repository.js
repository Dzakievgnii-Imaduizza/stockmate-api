const prisma = require('../config/prisma');

const create = async (data) => await prisma.product.create({ data });

const findByStore = async (storeId) => {
  return await prisma.product.findMany({
    where: { store_id: storeId },
    include: { 
      category: { select: { name: true } } 
    }
  });
};

const findById = async (id, storeId) => {
  return await prisma.product.findFirst({
    where: { id, store_id: storeId },
    include: { category: true }
  });
};

const update = async (id, storeId, data) => {
  return await prisma.product.updateMany({
    where: { id, store_id: storeId },
    data
  });
};

const remove = async (id, storeId) => {
  return await prisma.product.deleteMany({
    where: { id, store_id: storeId }
  });
};

// NEW: Function to count total products for a specific store
const countByStore = async (storeId) => {
  return await prisma.product.count({
    where: { store_id: storeId }
  });
};

module.exports = { create, findByStore, findById, update, remove, countByStore };