const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      default: null,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    sku: {
      type: String,
      unique: true,
      required: true,
    },

    images: {
      type: [imageSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one image is required.",
      },
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    tags: [String],

    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model("Product", productSchema);
