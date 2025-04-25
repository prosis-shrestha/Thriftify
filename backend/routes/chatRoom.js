const express = require("express");
const router = express.Router();
const ChatRoom = require("../models/Chatroom");

router.post("/create-chat-room", async (req, res) => {
  const { userId, recipientId, displayName1, displayName2 } = req.body;
  const room = [userId, recipientId].sort().join("_");

  try {
    let chatRoom = await ChatRoom.findOne({ room });
    if (!chatRoom) {
      chatRoom = new ChatRoom({
        room,
        users: [userId, recipientId],
        displayName1,
        displayName2,
      });
      await chatRoom.save();
    }
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: "Error creating chat room" });
  }
});

router.get("/chat-rooms/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const chatRooms = await ChatRoom.find({ users: userId });
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat rooms" });
  }
});

module.exports = router;
