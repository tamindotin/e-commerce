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

const addAddress = asyncHandler(async (req, res) => {
  const id = req.user;
  const { label, street, city, state, pincode, country } = req.body;

  if (!label || !street || !city || !state || !pincode || !country) {
    const error = new Error(
      "LABEL, STREET, CITY, STATE, PINCODE and COUNTRY is required for address",
    );
    error.status = 400;
    throw error;
  }

  const user = await User.findById(id);

  const isDefault = user.addresses.length == 0;

  user.addresses.push({
    label: label.toUpperCase(),
    street,
    city,
    state,
    pincode,
    country,
    isDefault,
  });

  await user.save();

  return res.status(200).json({
    success: true,
    message: "New address added",
    addresses: user.addresses,
  });
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const id = req.user;
  const addressId = req.params.id;

  const user = await User.findById(id);

  user.addresses.forEach((address) => {
    address.isDefault = false;
  });

  const address = user.addresses.id(addressId);

  if (!address) {
    const error = new Error("No address found. ");
    error.status = 400;
    throw error;
  }

  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

module.exports = { getAllAddresses, addAddress, setDefaultAddress };
