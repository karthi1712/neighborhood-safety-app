const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    // Use MongoDB Memory Server for local development
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("✅ Local MongoDB Memory Server Connected");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 