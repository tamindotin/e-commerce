const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");

const getAllAddresses = asyncHandler(async (req, res) => {
  const id = req.user;

  const user = await User.findById(id);

  if (user.addresses.length == 0) {
    return res.status(200).json({
      success: true,
      addresses: "No address to display. ",
    });
  }

  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

module.exports = { getAllAddresses };
