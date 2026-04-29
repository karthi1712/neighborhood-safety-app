require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const connectDB = require("./config/db");
const incidentRoutes = require("./routes/incidentRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const User = require("./models/User");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend/pages')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use('/components', express.static(path.join(__dirname, '../frontend/components')));

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ROUTES
app.use("/api/incidents", incidentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

app.use(errorHandler);

const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;
const FALLBACK_PORT = DEFAULT_PORT + 1;
let currentPort = DEFAULT_PORT;

const handleListenError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof currentPort === "string" ? `Pipe ${currentPort}` : `Port ${currentPort}`;
  if (error.code === "EADDRINUSE") {
    if (currentPort === DEFAULT_PORT) {
      console.warn(`⚠️ ${bind} is already in use. Attempting fallback port ${FALLBACK_PORT}...`);
      startListening(FALLBACK_PORT);
      return;
    }

    console.error(`❌ ${bind} is already in use. Please stop the process occupying the port or set a different PORT in .env.`);
    process.exit(1);
  }

  console.error("❌ Server error:", error);
  process.exit(1);
};

const startListening = (port) => {
  currentPort = port;
  server.once("error", handleListenError);
  server.listen(port, () => {
    console.log(`🔥 Server running on port ${port}`);
  });
};

// START SERVER AFTER DB CONNECT
const start = async () => {
  try {
    console.log("🔌 Connecting DB...");
    await connectDB();

    await User.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL || "admin@admin.com" },
      {
        $setOnInsert: {
          name: "Administrator",
          password: process.env.ADMIN_PASSWORD || "admin123",
          mobile: "0000000000",
          role: "admin"
        }
      },
      { upsert: true }
    );

    startListening(currentPort);
  } catch (err) {
    console.error("❌ Startup error:", err.message);
  }
};

start();