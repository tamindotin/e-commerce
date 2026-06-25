const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Name, Email and Password is required. ");
    error.status = 400;
    throw error;
  }

  if (await User.findOne({ email })) {
    const error = new Error("An account with this email already exists. ");
    error.status = 400;
    throw error;
  }

  await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Account created. You can login with this credentials. ",
  });
});



module.exports = { register };
