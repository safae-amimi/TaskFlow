const Task = require("../models/task");
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id })
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email");

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.assignTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id, { assignedTo: req.body.assignedTo }, { new: true }
    );
    if (task.assignedTo) {
      await Notification.create({
        user: task.assignedTo,
        message: `Une tâche vous a été assignée : "${task.title}"`,
        project: task.project
      });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};