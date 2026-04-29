const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mobile: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  lastLogin: {
    type: Date,
    default: null
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  notifications: [
    {
      incidentId: mongoose.Schema.Types.ObjectId,
      message: String,
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);