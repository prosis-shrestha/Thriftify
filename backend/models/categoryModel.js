const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    categoryName: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("category", categorySchema);
