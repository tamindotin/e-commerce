import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";

export const getAllAddresses = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id).select("addresses");

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  if (user.addresses.length == 0) {
    return res.status(200).json({
      success: true,
      addresses: [],
    });
  }

  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

export const addAddress = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { label, street, city, state, pincode, country } = req.body;

  const user = await User.findById(id).select("addresses");

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

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

  return res.status(201).json({
    success: true,
    message: "New address added",
    addresses: user.addresses,
  });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const addressId = req.params.id;

  const user = await User.findById(id).select("addresses");

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    const error = new Error("No address found. ");
    error.status = 404;
    throw error;
  }

  user.addresses.forEach((address) => {
    address.isDefault = false;
  });

  address.isDefault = true;

  await user.save();

  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const addressId = req.params.id;

  const user = await User.findById(id).select("addresses");

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    const error = new Error("No address found. ");
    error.status = 404;
    throw error;
  }

  if (address.isDefault) {
    const error = new Error("Cannot delete default address. ");
    error.status = 400;
    throw error;
  }

  address.deleteOne();

  await user.save();

  res.status(200).json({
    success: true,
    message: "Address deleted. ",
    addresses: user.addresses,
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const addressId = req.params.id;

  const user = await User.findById(id).select("addresses");

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    const error = new Error("No address found. ");
    error.status = 404;
    throw error;
  }

  const allowedFields = [
    "label",
    "street",
    "city",
    "state",
    "pincode",
    "country",
  ];

  if (req.body[allowedFields[0]] !== undefined) {
    req.body[allowedFields[0]] = req.body[allowedFields[0]].toUpperCase();
  }

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      address[field] = req.body[field];
    }
  });

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Address updated. ",
    addresses: user.addresses,
  });
});
