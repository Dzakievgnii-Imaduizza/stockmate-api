const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboard.controller');

// Assuming you have an auth middleware exported, similar to your user routes
const { protect, adminOnly } = require('../middlewares/auth.middleware'); 

// Get dashboard summary
router.get('/', protect, adminOnly, dashboardCtrl.getDashboardSummary);

module.exports = router;