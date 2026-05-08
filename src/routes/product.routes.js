const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.use(protect); // Lock everything down

router.post('/', protect, adminOnly, productCtrl.createProduct);
router.get('/', protect, adminOnly, productCtrl.getProducts);
router.patch('/:id/stock', protect, adminOnly, productCtrl.patchStock);

module.exports = router;