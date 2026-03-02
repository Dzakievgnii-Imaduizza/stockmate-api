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

module.exports = { createProduct, getProducts, patchStock };