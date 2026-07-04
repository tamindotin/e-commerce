const { required } = require("joi");
const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      publicId: String,
      url: String,
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema)
