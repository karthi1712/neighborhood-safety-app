const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  image_url: String,
  status: {
    type: String,
    default: "unverified"
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, { timestamps: true });

IncidentSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Incident", IncidentSchema);