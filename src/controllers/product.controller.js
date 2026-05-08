// const productService = require('../services/product.service');

// const createProduct = async (req, res) => {
//   try {
//     const product = await productService.addProduct(req.body, req.user.store_id);
//     res.status(201).json(product);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const getProducts = async (req, res) => {
//   try {
//     const products = await productService.getInventory(req.user.store_id);
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const patchStock = async (req, res) => {
//   try {
//     const { stock_qty } = req.body;
//     const updated = await productService.updateStock(req.params.id, req.user.store_id, stock_qty);
//     res.status(200).json({ message: "Stock updated", updated });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// module.exports = { createProduct, getProducts, patchStock };
const productService = require('../services/product.service');

const createProduct = async (req, res) => {
  try {
    const product = await productService.addProduct(req.body, req.user.store_id);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productService.getInventory(req.user.store_id);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchStock = async (req, res) => {
  try {
    const { stock_qty } = req.body;
    const updated = await productService.updateStock(req.params.id, req.user.store_id, stock_qty);
    res.status(200).json({ message: "Stock updated", updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// NEW: Update general product details
const updateProduct = async (req, res) => {
  try {
    // Clone the request body
    const updateData = { ...req.body };
    
    // Security: Explicitly remove protected fields so they cannot be overwritten
    delete updateData.id;
    delete updateData.store_id;
    delete updateData.created_at;

    const updated = await productService.editProduct(req.params.id, req.user.store_id, updateData);
    
    res.status(200).json({ message: "Product updated successfully", updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createProduct, getProducts, patchStock, updateProduct };