const User = require("../models/User");
const Incident = require("../models/Incident");

// GET ADMIN DASHBOARD DATA
exports.getDashboard = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized: Admin access required" });
    }

    const totalUsers = await User.countDocuments();
    const totalIncidents = await Incident.countDocuments();
    const recentIncidents = await Incident.find()
      .populate("reportedBy", "name email mobile")
      .sort({ createdAt: -1 })
      .limit(10);

    const recentLogins = await User.find()
      .select("name email lastLogin role")
      .sort({ lastLogin: -1 })
      .limit(10);

    const incidentsByStatus = await Incident.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const incidentsBySeverity = await Incident.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalIncidents,
      recentIncidents,
      recentLogins,
      incidentsByStatus,
      incidentsBySeverity
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized: Admin access required" });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL INCIDENTS
exports.getAllIncidentsAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized: Admin access required" });
    }

    const incidents = await Incident.find()
      .populate("reportedBy", "name email mobile")
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE INCIDENT STATUS
exports.updateIncidentStatus = async (req, res) => {
  try {
    const { email, status } = req.body;
    const incidentId = req.params.id;
    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized: Admin access required" });
    }

    const incident = await Incident.findByIdAndUpdate(
      incidentId,
      { status },
      { new: true }
    );

    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE INCIDENT
exports.deleteIncident = async (req, res) => {
  try {
    const { email } = req.body;
    const incidentId = req.params.id;
    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized: Admin access required" });
    }

    await Incident.findByIdAndDelete(incidentId);
    res.json({ msg: "Incident deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};