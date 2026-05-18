const supplierRepo = require("../repositories/supplier.repository");
const { getCoordinates } = require("../utils/geocode");

const createSupplier = async (data, storeId) => {

  const coords = await getCoordinates(data.address);

  return supplierRepo.create({
    store_id: storeId,
    name: data.name,
    phone: data.phone,
    address: data.address,
    latitude: coords.latitude,
    longitude: coords.longitude
  });

};

const getSuppliers = async (storeId) => {
  return supplierRepo.findByStore(storeId);
};

const getSupplierById = async (id, storeId) => {

  const supplier = await supplierRepo.findById(id, storeId);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
};

const updateSupplier = async (id, storeId, data) => {

  let coords = null;

  if (data.address) {
    coords = await getCoordinates(data.address);
  }

  return supplierRepo.update(id, storeId, {
    name: data.name,
    phone: data.phone,
    address: data.address,
    rating: data.rating? data.rating : undefined,
    latitude: coords ? coords.latitude : undefined,
    longitude: coords ? coords.longitude : undefined
  });

};

const deleteSupplier = async (id, storeId) => {
  return supplierRepo.remove(id, storeId);
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
};