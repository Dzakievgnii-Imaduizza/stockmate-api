const stockRuleRepo = require("../repositories/stockRule.repository");

const createStockRule = async (data, storeId) => {

  const existing = await stockRuleRepo.findByProduct(data.product_id);

  if (existing) {
    throw new Error("Stock rule already exists for this product");
  }
  if (data.min_threshold <= 0 || data.restock_suggestion <= 0){
    throw new Error("Values cannot be <= 0");
  }

  return stockRuleRepo.create({
    store_id: storeId,
    product_id: data.product_id,
    min_threshold: data.min_threshold,
    restock_suggestion: data.restock_suggestion
  });

};

const getStockRules = async (storeId) => {
  return stockRuleRepo.findByStore(storeId);
};

const updateStockRule = async (id, storeId, data) => {
  return stockRuleRepo.update(id, storeId, data);
};

const deleteStockRule = async (id, storeId) => {
  return stockRuleRepo.remove(id, storeId);
};

module.exports = {
  createStockRule,
  getStockRules,
  updateStockRule,
  deleteStockRule
};