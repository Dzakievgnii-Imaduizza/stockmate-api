const express = require("express");
const router = express.Router();

const controller = require("../controllers/stockRule.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, controller.createStockRule);
router.get("/", protect, controller.getStockRules);
router.put("/:id", protect, controller.updateStockRule); 
router.delete("/:id", protect, controller.deleteStockRule); 
module.exports = router;