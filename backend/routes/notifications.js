
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

router.get('/',  protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });
  res.json(notifications);
});

router.patch('/:id/read',  protect, async (req, res) => {
  const notif = await Notification.findByIdAndUpdate(
    req.params.id, { read: true }, { new: true }
  );
  res.json(notif);
});

module.exports = router;