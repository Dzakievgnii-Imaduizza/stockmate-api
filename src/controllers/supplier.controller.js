const supplierService = require("../services/supplier.service");

const createSupplier = async (req, res) => {
  try {

    const result = await supplierService.createSupplier(
      req.body,
      req.user.store_id
    );

    res.status(201).json(result);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSuppliers = async (req, res) => {
  try {

    const suppliers = await supplierService.getSuppliers(req.user.store_id);

    res.status(200).json(suppliers);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSupplierById = async (req, res) => {
  try {

    const supplier = await supplierService.getSupplierById(
      req.params.id,
      req.user.store_id
    );

    res.status(200).json(supplier);

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const updateSupplier = async (req, res) => {
  try {

    const result = await supplierService.updateSupplier(
      req.params.id,
      req.user.store_id,
      req.body
    );

    res.status(200).json({message: "Supplier Berhasil Update"});

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {

    await supplierService.deleteSupplier(
      req.params.id,
      req.user.store_id
    );

    res.status(200).json({
      message: "Supplier Meninggal"
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
};