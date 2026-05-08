// const categoryService = require('../services/category.service');

// const addCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const storeId = req.user.store_id; // Extracted from JWT
//     console.log(storeId);
//     const category = await categoryService.createCategory(name, storeId);
//     res.status(201).json(category);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const getAllCategories = async (req, res) => {
//   try {
//     const categories = await categoryService.getStoreCategories(req.user.store_id);
//     res.status(200).json(categories);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getOneCategory = async (req, res) => {
//   try {
//     const category = await categoryService.getCategoryById(req.params.id, req.user.store_id);
//     res.status(200).json(category);
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// };

// module.exports = { addCategory, getAllCategories, getOneCategory };

const categoryService = require('../services/category.service');

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const storeId = req.user.store_id; // Extracted from JWT
    const category = await categoryService.createCategory(name, storeId);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getStoreCategories(req.user.store_id);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOneCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id, req.user.store_id);
    res.status(200).json(category);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// NEW: Update category
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await categoryService.updateCategory(req.params.id, req.user.store_id, name);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// NEW: Delete category
const deleteCategory = async (req, res) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id, req.user.store_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { 
  addCategory, 
  getAllCategories, 
  getOneCategory, 
  updateCategory, 
  deleteCategory 
};