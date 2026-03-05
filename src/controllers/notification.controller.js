const notificationService = require("../services/notification.service");

const getNotifications = async (req, res) => {
  try {

    const notifications = await notificationService.getNotifications(req.user.id);

    res.status(200).json(notifications);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markRead = async (req, res) => {
  try {

    await notificationService.markNotificationRead(
      req.params.id,
      req.user.id
    );

    res.status(200).json({ message: "Notification marked as read" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getNotifications,
  markRead
};