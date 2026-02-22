const mongoose = require("mongoose");
require("colors");

const connectToDB = async () => {
  try {
    const obfuscatedUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, "//****:****@") : "undefined";
    console.log(`Connecting to: ${obfuscatedUri}`.cyan);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    console.log(`MongoDB connected successfully: ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`MongoDB connection failed: ${error.message}`.bgRed.white);
    console.log("Full error:".red, error);
  }
};

module.exports = connectToDB;
