const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/category.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// Apply protection to all category routes
router.use(protect);

router.post('/', adminOnly, categoryCtrl.addCategory);
router.get('/', categoryCtrl.getAllCategories);
router.get('/:id', categoryCtrl.getOneCategory);

module.exports = router;