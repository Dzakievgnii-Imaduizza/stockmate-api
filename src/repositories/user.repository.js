const prisma = require('../config/prisma');

const create = async (data) => await prisma.user.create({ data });

const findMany = async (storeId) => {
  return await prisma.user.findMany({
    where: storeId ? { store_id: storeId } : {},
    select: { id: true, name: true, email: true, role: true }
  });
};

const findBasic = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, store_id: true }
  });
};

const findWithStore = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { store: true }
  });
};

const findByEmail = async (email) => {
  // We need the password_hash here to verify login later
  return await prisma.user.findUnique({ where: { email } });
};

const update = async (id, data) => await prisma.user.update({ where: { id }, data });
const remove = async (id) => await prisma.user.delete({ where: { id } });

module.exports = { create, findMany, findBasic, findWithStore, findByEmail, update, remove };