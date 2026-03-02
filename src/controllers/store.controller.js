const storeService = require('../services/store.service');

const getAllStores = async (req, res) => {
  try {
    const stores = await storeService.fetchAllStores();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeRelations } = req.query;

    let store;
    if (includeRelations === 'true') {
      store = await storeService.fetchStoreFullDetails(id);
    } else {
      store = await storeService.fetchStoreSummary(id);
    }
    
    res.status(200).json(store);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createStore = async (req, res) => {
  try {
    const newStore = await storeService.createStore(req.body);
    res.status(201).json(newStore);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStore = async (req, res) => {
  const user_store_id = req.user?.store_id;
  if (user_store_id !== req.params.id){
    res.status(401).json({ "error": "Unauthorized" });
  }
  try {
    const updated = await storeService.updateStore(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStore = async (req, res) => {
  const user_store_id = req.user?.store_id;
  if (user_store_id !== req.params.id){
    res.status(401).json({ "error": "Unauthorized" });
  }
  try {
    await storeService.deleteStore(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
};