const productRepo = require('../repositories/product.repository');

const addProduct = async (productData, storeId) => {
  if (!productData.name || !productData.buy_price || !productData.sell_price || !productData.category_id || !productData.min_stock || !productData.unit ) {
    throw new Error('Name and Price are required');
  }
  // Force the store_id from the token
  return await productRepo.create({ ...productData, store_id: storeId });
};

const getInventory = async (storeId) => {
  return await productRepo.findByStore(storeId);
};

const updateStock = async (id, storeId, newQty) => {
  if (newQty < 0) throw new Error('Stock cannot be negative');
  return await productRepo.update(id, storeId, { stock_qty: newQty });
};

const deleteProduct = async (id, storeId) => {
  return await productRepo.remove(id, storeId);
};

module.exports = { addProduct, getInventory, updateStock, deleteProduct };