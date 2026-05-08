const userRepo = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (data) => {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new Error('Email already registered');

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  data.password_hash = await bcrypt.hash(data.password, salt);
  delete data.password;
  return await userRepo.create(data);
};

const loginUser = async (email, password) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid email or password');

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, role: user.role, store_id: user.store_id },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '1d' }
  );

  return { 
    token, 
    user: { id: user.id, name: user.name, role: user.role } 
  };
};

const getAllUsers = async (storeId) => await userRepo.findMany(storeId);
const getUserProfile = async (id, detailed) => {
  const user = detailed ? await userRepo.findWithStore(id) : await userRepo.findBasic(id);
  if (!user) throw new Error('User not found');
  return user;
};

const updateUser = async (id, data) => {
  if (data.password_hash) {
    const salt = await bcrypt.genSalt(10);
    data.password_hash = await bcrypt.hash(data.password_hash, salt);
  }
  if (data.otp) {
    const salt = await bcrypt.genSalt(10);
    data.otp = await bcrypt.hash(data.otp.toString(), salt);
  }
  return await userRepo.update(id, data);
};

// const verifyOtp = async (email, otp) => {
//   const user = await userRepo.findByEmail(email);
//   console.log(user);
//   if (!user) throw new Error('User not found');

//   const isMatch = await bcrypt.compare(otp, user.otp);
//   if (!isMatch) throw new Error('Invalid OTP');
//   return true;
// };
const verifyOtp = async (email, otp) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error('User not found');

  try {
      const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) throw new Error('Invalid OTP');
    const resetSessionToken = jwt.sign(
      { id: user.id, email: user.email, purpose: 'password_reset' },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '15m' } 
    );

    // Optional but recommended: Clear the OTP from the database so it can't be reused
    await userRepo.update(user.id, { otp: null });

    return { 
      message: 'OTP verified. Please proceed to reset your password.',
      resetToken: resetSessionToken 
    };
  } catch (error) {
    throw new Error('Invalid OTP');
  }
};

const executePasswordReset = async (resetToken, newPassword) => {
  try {
    // Verify the token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'supersecretkey');

    // 🛑 CRITICAL SECURITY CHECK: Ensure this is a reset token, not a regular login token
    if (decoded.purpose !== 'password_reset') {
      throw new Error('Invalid token type');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the DB
    const user = await userRepo.findByEmail(decoded.email);
    if (!user) {
      throw new Error('User not found');
    }
    await userRepo.update(user.id, { password_hash: hashedPassword });

    return { message: 'Password has been reset successfully. You can now log in.' };

  } catch (error) {
    // 🚨 UNMASK THE ERROR: Print it to the terminal!
    console.log("====================================");
    console.log("REAL RESET ERROR:", error);
    console.log("====================================");
    throw new Error('Temporary session expired or invalid. Please request a new OTP.');
  }
};

const getUserByEmail = async (email) => {
  return await userRepo.findByEmail(email);
};

const deleteUser = async (id) => await userRepo.remove(id);

module.exports = { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserProfile, 
  updateUser,
  verifyOtp,
  executePasswordReset,
  getUserByEmail, 
  deleteUser 
};