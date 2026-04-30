const auth = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// SIGNUP (real)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ msg: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PROTECTED ROUTE
router.get("/profile", auth, (req, res) => {
  res.json({
    msg: "Welcome user",
    userId: req.user.id
  });
});