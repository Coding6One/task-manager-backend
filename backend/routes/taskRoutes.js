const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      project: req.body.projectId,
      user: req.user.id
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET TASKS BY PROJECT
router.get("/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
      user: req.user.id
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



// UPDATE TASK STATUS
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    task.status = req.body.status || task.status;
    task.title = req.body.title || task.title;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});