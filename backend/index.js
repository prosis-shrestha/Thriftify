const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
require("./utils/db")();

const ChatRoom = require("./models/Chatroom");

//socket
const { createServer } = require("node:http");
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket on");

  socket.on("joinRoom", async ({ userId, recipientId }) => {
    const room = [userId, recipientId].sort().join("_");

    let chatRoom = await ChatRoom.findOne({ room });
    if (!chatRoom) {
      chatRoom = new ChatRoom({ room, users: [userId, recipientId] });
      await chatRoom.save();
    }

    socket.join(room);
    console.log(`User ${userId} joined room ${room}`);
  });

  socket.on(
    "privateMessage",
    async ({ userId, recipientId, message, room }) => {
      const chatRoom = await ChatRoom.findOne({ room });
      if (chatRoom) {
        chatRoom.messages.push({ userId, message });
        await chatRoom.save();
      }

      io.to(room).emit("privateMessage", { userId, message, room });
    }
  );

  socket.on("disconnect", () => {
    console.log("socket off");
  });
});

//

const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(
  session({
    name: "thrift.sid",
    secret: "thrift",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  })
);

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/product", require("./routes/productRoute"));
app.use("/api/transaction", require("./routes/transactionRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/category", require("./routes/categoryRote"));
app.use("/api/comment", require("./routes/CommentRoute"));
app.use("/api/chat", require("./routes/chatRoom"));
app.use("/api/checkout", require("./routes/checkoutRoute"));

app.use(require("./middlewares/error"));

server.listen(8000, () => console.log("server listening on port 8000"));
