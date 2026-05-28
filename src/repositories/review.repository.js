const prisma = require("../config/prisma");

const create = async (data) => {
  return prisma.reviews.create({ data });
};

const findBySupplier = async (supplierId) => {
  return prisma.reviews.findMany({
    where: { supplier_id: supplierId }
  });
};

const findById = async (Id) => {
  return prisma.reviews.findFirst({
    where: { id: Id }
  });
};

const findByUser = async (userId) => {
    return prisma.reviews.findMany({
        where: { user_id : userId}
    });
}

const update = async (id, data) => {
  return await prisma.reviews.updateMany({
    where: { id },
    data
  });
};



const remove = async (id) => {
  return prisma.reviews.deleteMany({
    where: {
      id : id
    }
  });
};

module.exports = {
  create,
  findBySupplier,
  findById,
  findByUser,
  update,
  remove
};