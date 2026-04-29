const express = require("express");
const router = express.Router();

const {
  createIncident,
  getAllIncidents,
  getNearbyIncidents
} = require("../controllers/incidentController");

router.post("/", createIncident);
router.get("/", getAllIncidents);
router.get("/near", getNearbyIncidents);

module.exports = router;