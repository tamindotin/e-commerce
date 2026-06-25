const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required. "],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required. "],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email. ",
      ],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required. "],
      minLength: [8, "Length must be 8 character length. "],
      select: false,
    },

    addresses: [
      {
        label: {
          type: String,
          enum: {
            values: ["HOME", "OFFICE", "OTHER"],
            message: "Label can be either HOME or OFFICE or OTHER",
          },
          default: "HOME",
          required: [true, "Label is required."],
        },
        street: {
          type: String,
          required: [true, "Street is required"],
          minLength: [6, "Street is too short"],
          maxLength: [100, "Street is too long"],
          trim: true,
          lowercase: true,
        },
        city: {
          type: String,
          required: [true, "City is required"],
          trim: true,
          lowercase: true,
        },
        state: {
          type: String,
          required: [true, "State is required"],
          trim: true,
        },
        pincode: {
          type: String,
          required: [true, "Pincode is required"],
          match: [/^[0-9]{6}$/, "Enter a valid 6-digit pincode"],
        },
        country: {
          type: String,
          default: "India",
          trim: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;

  const hashedPass = await bcrypt.hash(this.password, 10);

  this.password = hashedPass;

  next;
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
