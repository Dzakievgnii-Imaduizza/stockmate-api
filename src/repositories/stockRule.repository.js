const prisma = require("../config/prisma");

const create = async (data) => {
  return prisma.stockRule.create({ data });
};

const findByProduct = async (productId) => {
  return prisma.stockRule.findFirst({
    where: { product_id: productId }
  });
};

const findByStore = async (storeId) => {
  return prisma.stockRule.findMany({
    where: { store_id: storeId },
    include: {
      product: true
    }
  });
};

const update = async (id, storeId, data) => {
  return prisma.stockRule.updateMany({
    where: {
      id,
      store_id: storeId
    },
    data
  });
};

const remove = async (id, storeId) => {
  return prisma.stockRule.deleteMany({
    where: {
      id,
      store_id: storeId
    }
  });
};

module.exports = {
  create,
  findByProduct,
  findByStore,
  update,
  remove
};