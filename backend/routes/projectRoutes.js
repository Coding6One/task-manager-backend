const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");

// CREATE PROJECT
router.post("/", auth, async (req, res) => {
  try {
    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      user: req.user.id
    });

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER PROJECTS
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;