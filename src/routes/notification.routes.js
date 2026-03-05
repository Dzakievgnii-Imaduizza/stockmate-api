const express = require("express");
const router = express.Router();

const controller = require("../controllers/notification.controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/", protect, controller.getNotifications);
router.put("/:id/read", protect, controller.markRead);

module.exports = router;