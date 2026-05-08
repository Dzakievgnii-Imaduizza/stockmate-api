const productRepository = require('../repositories/product.repository');
const transactionRepository = require('../repositories/transaction.repository');
const supplierRepository = require('../repositories/supplier.repository'); // Assumes this exists

// 1. Get total products
const getTotalProducts = async (storeId) => {
  return await productRepository.countByStore(storeId);
};

// 2. Get total transactions within a specific time range
const getTotalTransactions = async (storeId, startDate, endDate) => {
  return await transactionRepository.countByDateRange(storeId, startDate, endDate);
};

// 3. Get total suppliers connected to the store
const getTotalSuppliers = async (storeId) => {
  return await supplierRepository.countByStore(storeId);
};

// 4. Get IN transactions within a specific time range
const getInTransactions = async (storeId, startDate, endDate) => {
  return await transactionRepository.findInTransactionsByDateRange(
    storeId, 
    startDate, 
    endDate
  );
};

// 5. Get OUT transactions within a specific time range
const getOutTransactions = async (storeId, startDate, endDate) => {
  return await transactionRepository.findOutTransactionsByDateRange(
    storeId, 
    startDate, 
    endDate
  );
};

module.exports = {
  getTotalProducts,
  getTotalTransactions,
  getTotalSuppliers,
  getInTransactions,
  getOutTransactions
};