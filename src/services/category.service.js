// const categoryRepo = require('../repositories/category.repository');

// const createCategory = async (name, storeId) => {
//   if (!name) throw new Error('Category name is required');
//   return await categoryRepo.create({ name, store_id: storeId });
// };

// const getStoreCategories = async (storeId) => {
//   return await categoryRepo.findByStore(storeId);
// };

// const getCategoryById = async (id, storeId) => {
//   const category = await categoryRepo.findById(id, storeId);
//   if (!category) throw new Error('Category not found or access denied');
//   return category;
// };

// const updateCategory = async (id, storeId, name) => {
//   return await categoryRepo.update(id, storeId, { name });
// };

// const deleteCategory = async (id, storeId) => {
//   return await categoryRepo.remove(id, storeId);
// };

// module.exports = { 
//   createCategory, 
//   getStoreCategories, 
//   getCategoryById, 
//   updateCategory, 
//   deleteCategory 
// };

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

// UPDATED: Validate name and check existence before updating
const updateCategory = async (id, storeId, name) => {
  if (!name) throw new Error('Category name is required');
  
  // Ensure the category actually exists and belongs to the store
  const category = await categoryRepo.findById(id, storeId);
  if (!category) throw new Error('Category not found or access denied');

  await categoryRepo.update(id, storeId, { name });
  return { message: 'Category updated successfully' };
};

// UPDATED: Enforce FK constraint logic
const deleteCategory = async (id, storeId) => {
  // 1. Fetch the category (which includes its associated products)
  const category = await categoryRepo.findById(id, storeId);
  
  if (!category) {
    throw new Error('Category not found or access denied');
  }

  // 2. Check if there are any products using this category
  if (category.products && category.products.length > 0) {
    throw new Error('Cannot delete category because it is currently assigned to one or more products.');
  }

  // 3. If no products are attached, proceed with deletion
  await categoryRepo.remove(id, storeId);
  return { message: 'Category deleted successfully' };
};

module.exports = { 
  createCategory, 
  getStoreCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
};