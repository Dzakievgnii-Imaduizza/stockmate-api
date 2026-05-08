const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transaction.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.post('/', protect, transactionController.createTransaction);
router.get('/', protect, transactionController.getAllTransactions);
router.get('/report', protect, adminOnly, transactionController.generateExcelReport);
router.get('/:id', protect, transactionController.getTransactionById);

module.exports = router;