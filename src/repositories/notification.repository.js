const prisma = require("../config/prisma");

const create = async (data) => {
  return prisma.notification.create({ data });
};

const findByUser = async (userId) => {
  return prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: {
      created_at: "desc"
    }
  });
};

const markAsRead = async (id, userId) => {
  return prisma.notification.updateMany({
    where: {
      id,
      user_id: userId
    },
    data: {
      is_read: true
    }
  });
};

module.exports = {
  create,
  findByUser,
  markAsRead
};