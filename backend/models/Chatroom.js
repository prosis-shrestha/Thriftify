const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  room: { type: String, required: true, unique: true },
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  displayName1: { type: String, required: true },
  displayName2: { type: String, required: true },
  messages: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
