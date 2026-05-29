// const productRepo = require('../repositories/product.repository');

// const addProduct = async (productData, storeId) => {
//   if (!productData.name || !productData.buy_price || !productData.sell_price || !productData.category_id || !productData.min_stock || !productData.unit ) {
//     throw new Error('Name and Price are required');
//   }
//   // Force the store_id from the token
//   return await productRepo.create({ ...productData, store_id: storeId });
// };

// const getInventory = async (storeId) => {
//   return await productRepo.findByStore(storeId);
// };

// const updateStock = async (id, storeId, newQty) => {
//   if (newQty < 0) throw new Error('Stock cannot be negative');
//   return await productRepo.update(id, storeId, { stock_qty: newQty });
// };

// const deleteProduct = async (id, storeId) => {
//   return await productRepo.remove(id, storeId);
// };

// module.exports = { addProduct, getInventory, updateStock, deleteProduct };
const productRepo = require('../repositories/product.repository');
const prisma = require('../config/prisma');

const addProduct = async (productData, storeId) => {
  if (!productData.name || !productData.buy_price || !productData.sell_price || !productData.category_id || !productData.min_stock || !productData.unit || !productData.supplier_id) {
    throw new Error('Name and Price are required');
  }
  if (productData.buy_price <= 0 || productData.sell_price <= 0 || productData.stock_qty <= 0|| productData.min_stock <= 0 ){
    throw new Error('Prices cannot be 0 or negative');
  }
  // Force the store_id from the token
  return await productRepo.create({ ...productData, store_id: storeId });
};

const getInventory = async (storeId) => {
  return await productRepo.findByStore(storeId);
};

const getById = async (productId) => {
  return await productRepo.findById(productId);
}

const updateStock = async (id, storeId, newQty) => {
  if (newQty < 0) throw new Error('Stock cannot be negative');
  return await productRepo.update(id, storeId, { stock_qty: newQty });
};

// NEW: Edit product fields
const editProduct = async (id, storeId, updateData) => {
  // 1. Check if product exists and belongs to this store
  const existingProduct = await productRepo.findById(id, storeId);
  if (!existingProduct) {
    throw new Error('Product not found or access denied');
  }

  // 2. Perform the update
  return await productRepo.update(id, storeId, updateData);
};

const deleteProduct = async (id, storeId) => {
  return await productRepo.remove(id, storeId);
};

/**
 * Menghitung ulang dan memperbarui tanggal predicted_stockout lewat Product Repository
 * @param {string} productId - ID dari produk yang ditransaksikan
 */
const updatePredictedStockout = async (productId) => {
  // 1. Ambil data produk murni lewat prisma langsung (karena fungsi repository butuh storeId)
  const product = await productRepo.findById(productId);

  if (!product) return null;

  let predictedStockoutDate = null;

  // 2. Logika kalkulasi jika stok masih ada
  if (product.stock_qty > 0) {
    const daysWindow = 14; 
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - daysWindow);

    // Hitung total quantity penjualan (type: "OUT") dalam rentang waktu
    const salesAggregate = await prisma.transaction.aggregate({
      where: {
        product_id: productId,
        type: "OUT",
        created_at: { gte: dateLimit }
      },
      _sum: { qty: true }
    });

    const totalSales = salesAggregate._sum.qty || 0;

    if (totalSales > 0) {
      const dailySalesRate = totalSales / daysWindow;
      const daysUntilStockout = product.stock_qty / dailySalesRate;

      const etaDate = new Date();
      etaDate.setDate(etaDate.getDate() + daysUntilStockout);
      predictedStockoutDate = etaDate;
    }
  } else {
    // Jika stok sudah 0 atau minus, prediksi habisnya adalah sekarang
    predictedStockoutDate = new Date();
  }

  // 3. Eksekusi update memanfaatkan fungsi dari product.repository kamu
  return await productRepo.update(productId, product.store_id, {
    predicted_stockout: predictedStockoutDate
  });
};

module.exports = { addProduct, getInventory, getById, updateStock, editProduct, deleteProduct, updatePredictedStockout };