const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transaction.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, transactionController.createTransaction);
router.get('/', protect, transactionController.getAllTransactions);
router.get('/:id', protect, transactionController.getTransactionById);

module.exports = router;