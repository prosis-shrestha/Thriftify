const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    text: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Comment", commentSchema);
