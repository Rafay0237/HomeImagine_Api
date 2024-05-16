const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const uplaodImageRoutes = require("./routes/uploadImage");
const proProfileRoutes = require("./routes/proProfile");
const proposalRoutes = require("./routes/proposal");
const chatRoutes = require("./routes/chat");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "*",
  })
);
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
let MongodbConnectionURI = process.env.CONNECTION_URI;

async function dbConnection() {
  await mongoose.connect(MongodbConnectionURI);
  console.log("Connected to Database");
}

dbConnection().catch((error) => console.log(error));

app.listen(PORT, HOST, () => {
  console.log("Server is listening");
});

app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to HomeImagine API" });
});

app.use("/users", userRoutes);

app.use("/upload-img", uplaodImageRoutes);

app.use("/pro", proProfileRoutes);

app.use("/proposal", proposalRoutes);

app.use("/chat", chatRoutes);

// socket server here 

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});

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
    console.log(senderId,receiverId,text)
    const receiver = getUser(receiverId);
    if (!receiver) return;
    socket.to(receiver.socketId).emit("getMessage", {
      senderId,
      text
    });
  });

  socket.on("sendImage", ({ senderId, receiverId, img }) => {
    console.log(senderId,receiverId,img)
    const receiver = getUser(receiverId);
    if (!receiver) return;
    socket.to(receiver.socketId).emit("getImage", {
      senderId,
      img
    });
  });

  console.log(users);
});
