const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    image: {
      type: String,
      // required: true,
    },
    price: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      required: true,
    },

    condition: {
      type: String,
      enums: ["New", "Like new", "Used"],
      required: true,
    },
    gender: {
      type: String,
      enums: ["Male", "Female", "Other"],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    preciseLat: {
      type: Number,
      required: false,
    },
    preciseLon: {
      type: Number,
      required: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    sold: {
      type: Boolean,
      default: false,
    },
    boosted: Boolean,
    boostDays: Number,
    boostEndDate: Date,
    reviewed: Boolean,
  },
  { timestamps: true }
);

productSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("product", productSchema);
