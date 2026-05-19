const express = require("express");
const router = express.Router();
const taskCtrl = require("../controllers/taskController");
const auth = require("../middlewares/auth");

router.get("/my-tasks", auth, taskCtrl.getMyTasks);

router.post("/tasks", auth, taskCtrl.createTask);
router.get("/tasks/:id", auth, taskCtrl.getTask);
router.put("/tasks/:id", auth, taskCtrl.updateTask);
router.delete("/tasks/:id", auth, taskCtrl.deleteTask);
router.patch("/tasks/:id/status", auth, taskCtrl.updateStatus);
router.patch("/tasks/:id/assign", auth, taskCtrl.assignTask);
router.get("/projects/:id/tasks", auth, taskCtrl.getTasksByProject);
module.exports = router;