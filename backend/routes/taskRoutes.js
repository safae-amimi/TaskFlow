const express = require("express");
const router = express.Router();
const taskCtrl = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

router.get("/my-tasks", protect, taskCtrl.getMyTasks);

router.post("/tasks", protect, taskCtrl.createTask);
router.get("/tasks/:id", protect, taskCtrl.getTask);
router.put("/tasks/:id", protect, taskCtrl.updateTask);
router.delete("/tasks/:id", protect, taskCtrl.deleteTask);
router.patch("/tasks/:id/status", protect, taskCtrl.updateStatus);
router.patch("/tasks/:id/assign", protect, taskCtrl.assignTask);
router.get("/projects/:id/tasks", protect, taskCtrl.getTasksByProject);
module.exports = router;