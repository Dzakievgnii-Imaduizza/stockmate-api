const categoryRepo = require('../repositories/category.repository');

const createCategory = async (name, storeId) => {
  if (!name) throw new Error('Category name is required');
  return await categoryRepo.create({ name, store_id: storeId });
};

const getStoreCategories = async (storeId) => {
  return await categoryRepo.findByStore(storeId);
};

const getCategoryById = async (id, storeId) => {
  const category = await categoryRepo.findById(id, storeId);
  if (!category) throw new Error('Category not found or access denied');
  return category;
};

const updateCategory = async (id, storeId, name) => {
  return await categoryRepo.update(id, storeId, { name });
};

const deleteCategory = async (id, storeId) => {
  return await categoryRepo.remove(id, storeId);
};

module.exports = { 
  createCategory, 
  getStoreCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
};