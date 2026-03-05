const prisma = require('../config/prisma');

const create = async (data) => {
  return prisma.transaction.create({
    data,
    include: {
      product: true,
      user: true
    }
  });
};

const findAllByStore = async (storeId) => {
  return prisma.transaction.findMany({
    where: {
      product: {
        store_id: storeId
      }
    },
    include: {
      product: true,
      user: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
};

const findById = async (id, storeId) => {
  return prisma.transaction.findFirst({
    where: {
      id: id,
      product: {
        store_id: storeId
      }
    },
    include: {
      product: true,
      user: true
    }
  });
};

module.exports = {
  create,
  findAllByStore,
  findById
};