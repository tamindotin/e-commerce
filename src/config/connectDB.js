const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected.");
  } catch (error) {
    throw new Error("Error in DB connection.");
    console.log(error.message);
  }
};

module.exports = connectDB();
