const express = require("express");
const router = express.Router();

const controller = require("../controllers/stockRule.controller");
const { adminOnly } = require("../middlewares/auth.middleware");

router.post("/", adminOnly, controller.createStockRule);
router.get("/", adminOnly, controller.getStockRules);
router.put("/:id", adminOnly, controller.updateStockRule); 
router.delete("/:id", adminOnly, controller.deleteStockRule); 
module.exports = router;