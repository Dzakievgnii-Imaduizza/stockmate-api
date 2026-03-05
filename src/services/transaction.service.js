const prisma = require('../config/prisma');
const { checkStockAndNotify } = require("./notification.service");

const createTransaction = async (data) => {

  const product = await prisma.product.findUnique({
    where: { id: data.product_id }
  });

  if (!product) {
    throw new Error("Product not found");
  }

  let newStock = product.stock_qty;

  if (data.type === "IN") {
    newStock += data.qty;
  }

  if (data.type === "OUT") {

    if (product.stock_qty < data.qty) {
      throw new Error("Stock not enough");
    }

    newStock -= data.qty;
  }

  const result = await prisma.$transaction(async (tx) => {

    const trx = await tx.transaction.create({
      data: {
        product_id: data.product_id,
        user_id: data.user_id,
        type: data.type,
        qty: data.qty,
        note: data.note
      }
    });

    await tx.product.update({
      where: { id: data.product_id },
      data: {
        stock_qty: newStock
      }
    });

    return trx;
  });

  await checkStockAndNotify(data.product_id);

  console.log("Masuk");

  return result;
};

const getAllTransactions = async (storeId) => {

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
      created_at: "desc"
    }
  });

};

const getTransactionById = async (id, storeId) => {

  const trx = await prisma.transaction.findFirst({
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

  if (!trx) {
    throw new Error("Transaction not found");
  }

  return trx;
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById
};