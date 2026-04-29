const Incident = require("../models/Incident");
const User = require("../models/User");

// CREATE
exports.createIncident = async (req, res) => {
  try {
    const { title, description, category, severity, lat, lng, userId } = req.body;

    if (!title || !lat || !lng) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const incident = await Incident.create({
      title,
      description,
      category,
      severity,
      reportedBy: userId || null,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      }
    });

    // Notify nearby users (within 50km), excluding default coordinates at [0,0]
    const nearbyUsers = await User.find({
      "location.coordinates": { $ne: [0, 0] },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 50000
        }
      }
    });

    // Add notification to each nearby user
    for (let user of nearbyUsers) {
      user.notifications.push({
        incidentId: incident._id,
        message: `New incident: ${title} (${severity} severity) near your location`,
        read: false
      });
      await user.save();
    }

    // Emit real-time update
    req.io.emit("newIncident", incident);
    req.io.emit("notificationUpdate", { userIds: nearbyUsers.map(u => u._id) });

    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getAllIncidents = async (req, res) => {
  const data = await Incident.find().populate("reportedBy", "name email").sort({ createdAt: -1 });
  res.json(data);
};

// GET NEARBY
exports.getNearbyIncidents = async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;

  const data = await Incident.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseInt(radius)
      }
    }
  }).populate("reportedBy", "name email");

  res.json(data);
};