const prisma = require('../config/prisma');

const create = async (data) => await prisma.store.create({ data });
const findMany = async () => await prisma.store.findMany();
const findBasic = async (id) => await prisma.store.findUnique({ where: { id } });

const findWithDetails = async (id) => {
  return await prisma.store.findUnique({
    where: { id },
    include: {
      users: true,
      categories: true,
      products: true
    }
  });
};

const update = async (id, data) => await prisma.store.update({ where: { id }, data });
const remove = async (id) => await prisma.store.delete({ where: { id } });

const findByOwner = async (ownerId) => {
  return await prisma.store.findUnique({
    where: { owner_id: ownerId } 
    // Note: This works if owner_id is marked as @unique in your Prisma schema
  });
};

module.exports = { 
  create, 
  findMany, 
  findBasic, 
  findWithDetails, 
  update, 
  remove,
  findByOwner
};