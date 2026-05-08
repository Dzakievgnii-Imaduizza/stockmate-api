const express = require("express");
const router = express.Router();

const supplierController = require("../controllers/supplier.controller");
const { protect, adminOnly} = require("../middlewares/auth.middleware");

router.post("/", protect, adminOnly, supplierController.createSupplier);

router.get("/", protect, supplierController.getSuppliers);

router.get("/:id", protect, supplierController.getSupplierById);

router.put("/:id", protect, supplierController.updateSupplier);

router.delete("/:id", protect, supplierController.deleteSupplier);

module.exports = router;