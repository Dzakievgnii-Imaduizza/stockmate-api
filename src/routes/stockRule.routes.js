const express = require("express");
const router = express.Router();

const controller = require("../controllers/stockRule.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.post("/", protect, adminOnly, controller.createStockRule);
router.get("/", protect, adminOnly, controller.getStockRules);
router.put("/:id", protect, adminOnly, controller.updateStockRule);
router.delete("/:id", protect, adminOnly, controller.deleteStockRule);
module.exports = router;