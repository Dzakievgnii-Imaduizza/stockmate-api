const userService = require('../services/user.service');
const n8nService = require('../services/n8n.service');

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
    const store_id = req.user.store_id
    const users = await userService.getAllUsers(store_id);
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
const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id, req.query.includeStore === 'true');
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

const giveOtp = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const id = user.id;

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP

    await userService.updateUser(id, { otp: otp });
    await n8nService.sendResetCodeEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const verifyOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValidOtp = await userService.verifyOtp(email, otp);

    if (!isValidOtp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    res.status(200).json({
      message: "OTP verified successfully",
      token: isValidOtp.resetToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    // Note: We expect the frontend to send the temporary token in the body, 
    // but you could also extract it from a Bearer header if you prefer.
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const result = await userService.executePasswordReset(resetToken, newPassword);
    return res.status(200).json(result);

  } catch (err) {
    return res.status(401).json({ error: err.message }); // 401 Unauthorized for expired/invalid tokens
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

module.exports = { register, login, getUsers, getUserById,getUserProfile, patchUser, removeUser, verifyOtp, giveOtp, resetPassword };