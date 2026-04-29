const express = require("express");
const router = express.Router();

const { register, login, summary, getNotifications, markNotificationsRead, updateLocation } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/summary", summary);
router.get("/notifications", getNotifications);
router.post("/notifications/read", markNotificationsRead);
router.put("/location", updateLocation);

module.exports = router;