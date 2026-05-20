
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

router.get('/project/:id', auth, async (req, res) => {
    const activities = await Activity.find({ project: req.params.id })
        .populate('user', 'name')
        .sort({ createdAt: -1 });
    res.json(activities);
});

module.exports = router;