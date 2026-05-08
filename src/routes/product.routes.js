// const express = require('express');
// const router = express.Router();
// const productCtrl = require('../controllers/product.controller');
// const { protect, adminOnly } = require('../middlewares/auth.middleware');

// router.use(protect); // Lock everything down

// router.post('/', protect, adminOnly, productCtrl.createProduct);
// router.get('/', protect, adminOnly, productCtrl.getProducts);
// router.patch('/:id/stock', protect, adminOnly, productCtrl.patchStock);

// module.exports = router;
const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// Lock everything down
router.use(protect); 

router.post('/', adminOnly, productCtrl.createProduct);
router.get('/', productCtrl.getProducts);

// Existing specific patch
router.patch('/:id/stock', adminOnly, productCtrl.patchStock);

// NEW: General patch for editing product details
router.patch('/:id', adminOnly, productCtrl.updateProduct); // AMAN MAS HARUSNYA

module.exports = router;