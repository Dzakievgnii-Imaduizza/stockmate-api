const transactionService = require('../services/transaction.service');

const createTransaction = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    const data = {
      product_id: req.body.product_id,
      qty: req.body.qty,
      type: req.body.type,
      note: req.body.note,
      user_id: userId
    };

    const result = await transactionService.createTransaction(data);

    return res.status(201).json(result);

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const transactions = await transactionService.getAllTransactions(
      req.user.store_id
    );

    return res.status(200).json(transactions);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getTransactionById = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const trx = await transactionService.getTransactionById(
      req.params.id,
      req.user.store_id
    );

    return res.status(200).json(trx);

  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById
};