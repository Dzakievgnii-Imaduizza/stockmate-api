// const prisma = require('../config/prisma');

// const create = async (data) => {
//   return await prisma.category.create({ data });
// };

// const findByStore = async (storeId) => {
//   return await prisma.category.findMany({
//     where: { store_id: storeId },
//     include: { _count: { select: { products: true } } } // Useful to see how many products are in each category
//   });
// };

// const findById = async (id, storeId) => {
//   return await prisma.category.findFirst({
//     where: { 
//       id: id,
//       store_id: storeId // Safety: ensures user can't peek into other stores
//     },
//     include: { products: true }
//   });
// };

// const update = async (id, storeId, data) => {
//   return await prisma.category.updateMany({
//     where: { id: id, store_id: storeId },
//     data
//   });
// };

// const remove = async (id, storeId) => {
//   return await prisma.category.deleteMany({
//     where: { id: id, store_id: storeId }
//   });
// };

// module.exports = { create, findByStore, findById, update, remove };

const prisma = require('../config/prisma');

const create = async (data) => {
  return await prisma.category.create({ data });
};

const findByStore = async (storeId) => {
  return await prisma.category.findMany({
    where: { store_id: storeId },
    include: { _count: { select: { products: true } } } 
  });
};

const findById = async (id, storeId) => {
  return await prisma.category.findFirst({
    where: { 
      id: id,
      store_id: storeId 
    },
    include: { products: true } // This powers the check in the service layer!
  });
};

const update = async (id, storeId, data) => {
  return await prisma.category.updateMany({
    where: { id: id, store_id: storeId },
    data
  });
};

const remove = async (id, storeId) => {
  return await prisma.category.deleteMany({
    where: { id: id, store_id: storeId }
  });
};

module.exports = { create, findByStore, findById, update, remove }