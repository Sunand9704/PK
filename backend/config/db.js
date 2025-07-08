const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUrl =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/PK-TRENDS";
    const conn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
