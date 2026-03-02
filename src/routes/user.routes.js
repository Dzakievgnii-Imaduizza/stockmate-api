const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/', userCtrl.getUsers);
router.get('/:id', userCtrl.getUserById);
router.patch('/:id', userCtrl.patchUser);
router.delete('/:id', userCtrl.removeUser);

module.exports = router;