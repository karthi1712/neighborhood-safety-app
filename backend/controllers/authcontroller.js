const User = require("../models/User");
const Incident = require("../models/Incident");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = await User.create({ name, email, password, mobile });

    res.json({ msg: "User registered successfully", user });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, lat, lng } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Update last login and location
    user.lastLogin = new Date();
    if (lat && lng) {
      user.location = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      };
    }
    await user.save();

    res.json({ msg: "Login successful", user });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// SUMMARY
exports.summary = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const incidentCount = await Incident.countDocuments();
    res.json({ userCount, incidentCount });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ msg: "Email required" });

    const user = await User.findOne({ email }).select("notifications");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.notifications = user.notifications.map((note) => ({
      ...note.toObject(),
      read: true
    }));
    await user.save();

    res.json(user.notifications);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { email, lat, lng } = req.body;
    if (!email || lat == null || lng == null) {
      return res.status(400).json({ msg: "Email, lat and lng required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.location = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };
    user.lastLogin = new Date();
    await user.save();

    res.json({ msg: "Location updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};