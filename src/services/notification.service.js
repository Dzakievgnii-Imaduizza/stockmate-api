const notificationRepo = require("../repositories/notification.repository");
const stockRuleRepo = require("../repositories/stockRule.repository");
const prisma = require("../config/prisma");

const checkStockAndNotify = async (productId) => {

  const rule = await stockRuleRepo.findByProduct(productId);

  if (!rule) return;

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (product.stock_qty > rule.min_threshold) return;

  const users = await prisma.user.findMany({
    where: { store_id: rule.store_id }
  });

  for (const user of users) {

    await notificationRepo.create({
      user_id: user.id,
      product_id: productId,
      message: `Stock ${product.name} tinggal ${product.stock_qty}. Disarankan restock ${rule.restock_suggestion}`
    });

  }

};

const getNotifications = async (userId) => {
  return notificationRepo.findByUser(userId);
};

const markNotificationRead = async (id, userId) => {
  return notificationRepo.markAsRead(id, userId);
};

module.exports = {
  checkStockAndNotify,
  getNotifications,
  markNotificationRead
};