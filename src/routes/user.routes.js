const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/request-password-reset', userCtrl.giveOtp);
router.post('/verify-otp', userCtrl.verifyOtp);
router.get('/', protect, adminOnly, userCtrl.getUsers);
router.get('/profile', protect, userCtrl.getUserProfile);
router.get('/:id', protect, adminOnly, userCtrl.getUserById);
router.patch('/:id', protect, adminOnly, userCtrl.patchUser);
router.post('/reset-password', userCtrl.resetPassword);
router.delete('/:id', protect, adminOnly, userCtrl.removeUser);

module.exports = router;