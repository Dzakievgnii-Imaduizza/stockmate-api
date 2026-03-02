const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect); // Lock everything down

router.post('/', productCtrl.createProduct);
router.get('/', productCtrl.getProducts);
router.patch('/:id/stock', productCtrl.patchStock);

module.exports = router;