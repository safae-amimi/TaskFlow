
const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const Project = require('../models/project');
const { protect } = require('../middleware/auth');
router.get('/',  protect, async (req, res) => {
    const userId = req.user.id;
    const now = new Date();

    const activeProjects = await Project.countDocuments({
        $or: [{ owner: userId }, { members: userId }],
        status: 'actif'
});
const stats = await Task.aggregate([
    { $match: { assignedTo: require('mongoose').Types.ObjectId(userId) } },
    {
        $group: {
            _id: null,
            totalAssigned: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'terminé'] }, 1, 0] } },
        late: {
            $sum: {
                $cond: [
                    { $and: [{ $lt: ['$deadline', now] }, { $ne: ['$status', 'terminé'] }] },
                1, 0
                ]
            }
        }
        }
    }
]);
const inProgress = await Task.find({
    assignedTo: userId,
    status: { $ne: 'terminé' }
}).sort({ priority: -1, deadline: 1 });

res.json({
    activeProjects,
    totalAssigned: stats[0]?.totalAssigned || 0,
    completed: stats[0]?.completed || 0,
    late: stats[0]?.late || 0,
    inProgress
});
});

module.exports = router;