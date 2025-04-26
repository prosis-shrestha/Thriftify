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
        "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
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
