const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      // required: true,
    },
    about: {
      type: String,
      // required: true,
    },
    image: {
      type: String,
      default:
        "https://imgs.search.brave.com/02hSRB0MzmY00MNyqpSAM3R1war1rNL3SHXb3pg5ce0/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RkL2M3/L2FjL2RkYzdhYzNj/NzZkZjIwMjA0MWFh/ZWVlNmFlMWY5MDg0/LmpwZw",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
