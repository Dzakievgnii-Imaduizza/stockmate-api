const stockRuleService = require("../services/stockRule.service");

const createStockRule = async (req, res) => {
  try {

    const rule = await stockRuleService.createStockRule(
      req.body,
      req.user.store_id
    );

    res.status(201).json(rule);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getStockRules = async (req, res) => {
  try {

    const rules = await stockRuleService.getStockRules(
      req.user.store_id
    );

    res.status(200).json(rules);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStockRule = async (req, res) => {
  try {

    const result = await stockRuleService.updateStockRule(
      req.params.id,
      req.user.store_id,
      req.body
    );

    res.status(200).json({message : "Berhasil di Update"});

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteStockRule = async (req, res) => {
  try {

    await stockRuleService.deleteStockRule(
      req.params.id,
      req.user.store_id
    );

    res.status(200).json({
      message: "Stock rule deleted"
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createStockRule,
  getStockRules,
  updateStockRule,
  deleteStockRule
};