const { use } = require('react');
const storeRepo = require('../repositories/store.repository');
const userRepo = require('../repositories/user.repository')

const fetchAllStores = async () => {
  return await storeRepo.findMany();
};

const fetchStoreSummary = async (id) => {
  const store = await storeRepo.findBasic(id);
  if (!store) throw new Error('Store not found');
  return store;
};

const fetchStoreFullDetails = async (id) => {
  const store = await storeRepo.findWithDetails(id);
  if (!store) throw new Error('Store not found');
  return store;
};

const createStore = async (data) => {
  const { name, owner_id } = data;

  // 1. Validation: Ensure required fields are present
  if (!name || !owner_id) {
    throw new Error('Store name and owner_id are required');
  }

  // 2. Logic: Check if this user already owns a store
  // We can use the findMany or a specific check in the repo
  const existingStore = await storeRepo.findByOwner(owner_id);
  
  if (existingStore) {
    throw new Error('This user already owns a store. One owner per store policy.');
  }

  // 3. Continue: If no store exists, create it
  const newStore = await storeRepo.create(data);
  const owner = await userRepo.findBasic(owner_id);
  owner.store_id = newStore.id;
  await userRepo.update(owner_id, owner);
  return newStore;
};
const updateStore = async (id, data) => await storeRepo.update(id, data);
const deleteStore = async (id) => await storeRepo.remove(id);

module.exports = {
  fetchAllStores,
  fetchStoreSummary,
  fetchStoreFullDetails,
  createStore,
  updateStore,
  deleteStore
};