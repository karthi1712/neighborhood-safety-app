const express = require("express");
const router = express.Router();

const {
  getDashboard,
  getAllUsers,
  getAllIncidentsAdmin,
  updateIncidentStatus,
  deleteIncident
} = require("../controllers/adminController");

router.post("/dashboard", getDashboard);
router.post("/users", getAllUsers);
router.post("/incidents", getAllIncidentsAdmin);
router.put("/incidents/:id/status", updateIncidentStatus);
router.delete("/incidents/:id", deleteIncident);

module.exports = router;