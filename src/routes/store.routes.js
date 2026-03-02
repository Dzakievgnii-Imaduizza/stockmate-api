const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.get('/',protect, adminOnly, storeController.getAllStores);
router.get('/:id', protect, adminOnly, storeController.getStoreById);
router.post('/', protect, adminOnly, storeController.createStore);
router.patch('/:id', protect, adminOnly, storeController.updateStore);
router.delete('/:id', protect, adminOnly, storeController.deleteStore);


// THIS IS THE MISSING LINE:
module.exports = router;