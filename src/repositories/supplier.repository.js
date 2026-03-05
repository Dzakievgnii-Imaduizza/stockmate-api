const prisma = require("../config/prisma");

const create = async (data) => {
  return prisma.supplier.create({ data });
};

const findByStore = async (storeId) => {
  return prisma.supplier.findMany({
    where: {
      store_id: storeId
    },
    orderBy: {
      created_at: "desc"
    }
  });
};

const findById = async (id, storeId) => {
  return prisma.supplier.findFirst({
    where: {
      id: id,
      store_id: storeId
    }
  });
};

const update = async (id, storeId, data) => {
  return prisma.supplier.updateMany({
    where: {
      id: id,
      store_id: storeId
    },
    data
  });
};

const remove = async (id, storeId) => {
  return prisma.supplier.deleteMany({
    where: {
      id: id,
      store_id: storeId
    }
  });
};

module.exports = {
  create,
  findByStore,
  findById,
  update,
  remove
};