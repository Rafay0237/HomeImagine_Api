const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require('body-parser');
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const userRoutes = require("./routes/user");
const uploadImageRoutes = require("./routes/uploadImage");
const proProfileRoutes = require("./routes/proProfile");
const proposalRoutes = require("./routes/proposal");
const chatRoutes = require("./routes/chat");
const productRoutes = require('./routes/product');
const contractRoutes = require("./routes/contract");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to HomeImagine API" });
});
app.use("/users", userRoutes);
app.use("/upload-img", uploadImageRoutes);
app.use("/pro", proProfileRoutes);
app.use("/proposal", proposalRoutes);
app.use("/chat", chatRoutes);
app.use('/products', productRoutes);
app.use('/contract', contractRoutes);

// Socket.IO connection handling
let users = [];

const addUsers = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUsers = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("disconnect", () => {
    removeUsers(socket.id);
    console.log("User Disconnected");
    io.emit("getUsers", users);
  });

  socket.on("addUser", (userId) => {
    addUsers(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.emit("getUsers", users);

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const receiver = getUser(receiverId);
    if (!receiver) return;
    socket.to(receiver.socketId).emit("getMessage", {
      senderId,
      text
    });
  });

  socket.on("sendImage", ({ senderId, receiverId, img }) => {
    const receiver = getUser(receiverId);
    if (!receiver) return;
    socket.to(receiver.socketId).emit("getImage", {
      senderId,
      img
    });
  });

  socket.on("messageSeen", ({ conversationId, sender }) => {
    const receiver = getUser(sender);
    if (!receiver) return;
    socket.to(receiver.socketId).emit("updateMessageSeen", {
      conversationId,
      sender
    });
  });

  console.log(users);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const MongodbConnectionURI = process.env.CONNECTION_URI;

async function dbConnection() {
  await mongoose.connect(MongodbConnectionURI);
  console.log("Connected to Database");
}

dbConnection().catch((error) => console.log(error));

server.listen(PORT, HOST, () => {
  console.log(`Server is listening on ${HOST}:${PORT}`);
});

