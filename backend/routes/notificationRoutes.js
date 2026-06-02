const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .populate("issue", "title status category")
    .sort({ read: 1, createdAt: -1 });

  res.json(notifications);
});

router.patch("/:id/read", protect, async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.json(notification);
});

router.patch("/read-all", protect, async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, read: false },
    { read: true }
  );

  res.json({ message: "All notifications marked as read" });
});

module.exports = router;
