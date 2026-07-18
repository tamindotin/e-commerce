import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected.");
  } catch (error) {
    console.log("Error in DB connection.", error.message);
    process.exit(1);
  }
};

export default connectDB;
