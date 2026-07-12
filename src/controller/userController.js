const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");

const getProfile = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id).select("name email verified");

  if (!user) {
    const error = new Error("user not found. ");
    error.status = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    info: user,
  });
});

module.exports = { getProfile };
