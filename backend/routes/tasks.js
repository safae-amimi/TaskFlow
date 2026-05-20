
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// GET tasks with filter + search + pagination
router.get('/project/:projectId', auth, async (req, res) => {
  const { status, priority, assignedTo, search, page = 1, limit = 10 } = req.query;
  const filter = { project: req.params.projectId };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const data = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .skip(skip).limit(parseInt(limit));
  const total = await Task.countDocuments(filter);

  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
});

// POST create task
router.post('/', auth, async (req, res) => {
  const task = new Task({ ...req.body });
  await task.save();

  await Activity.create({
    type: 'task_created',
    project: task.project,
    user: req.user.id,
    details: `Tâche "${task.title}" créée`
  });

  // Notification if assigned
  if (task.assignedTo) {
    await Notification.create({
      user: task.assignedTo,
      message: `Une tâche vous a été assignée : "${task.title}"`,
      project: task.project
    });
  }

  res.status(201).json(task);
});

// PATCH update status
router.patch('/:id/status', auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  await Activity.create({
    type: 'task_status_changed',
    project: task.project,
    user: req.user.id,
    details: `Statut de "${task.title}" changé à "${task.status}"`
  });

  res.json(task);
});

// DELETE task
router.delete('/:id', auth, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  await Activity.create({
    type: 'task_deleted',
    project: task.project,
    user: req.user.id,
    details: `Tâche "${task.title}" supprimée`
  });
  res.json({ message: 'Tâche supprimée' });
});

module.exports = router;
