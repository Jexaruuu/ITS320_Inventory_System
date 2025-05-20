const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: "Username already exists." });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    res.sendStatus(201);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed." });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user._id; // ✅ sets session
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
};

exports.getCurrentUser = async (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  const user = await User.findById(req.session.user).select('username');
  if (!user) return res.sendStatus(404);

  res.json({ username: user.username });
};