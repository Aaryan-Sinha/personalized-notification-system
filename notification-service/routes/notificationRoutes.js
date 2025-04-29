const express = require("express");
const router = express.Router();
const {
  getUnreadNotifications,
  markAsRead,
} = require("../controllers/notificationController");

router.get("/unread/:userId", getUnreadNotifications);
router.put("/read/:id", markAsRead);

module.exports = router;
