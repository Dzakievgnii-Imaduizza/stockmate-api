const userService = require('../services/user.service');

const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    // Don't send the password back in the response
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const login = async (req, res) => {
  try {
    // Change this line to look for 'password' instead of 'password_hash'
    const { email, password } = req.body; 
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await userService.loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query.store_id);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.params.id, req.query.includeStore === 'true');
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const patchUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login, getUsers, getUserById, patchUser, removeUser };