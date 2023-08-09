const mongoose = require("mongoose");
require('dotenv').config()
console.log(process.env)

const connectDB = async () => {
  try {
    await mongoose.createConnection(process.env.MONGODB_CONNECT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000, // Increase the timeout value (in milliseconds)
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Connection to MongoDB failed: " + error.message);
  }
};

module.exports = connectDB;
