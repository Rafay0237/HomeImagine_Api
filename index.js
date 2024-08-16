const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const uploadImageRoutes = require("./routes/uploadImage");
const proProfileRoutes = require("./routes/proProfile");
const proposalRoutes = require("./routes/proposal");
const chatRoutes = require("./routes/chat");
const productRoutes = require('./routes/product');
const contractRoutes = require("./routes/contract");

const app = express();

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


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const MongodbConnectionURI = process.env.CONNECTION_URI;

async function dbConnection() {
  await mongoose.connect(MongodbConnectionURI);
  console.log("Connected to Database");
}

dbConnection().catch((error) => console.log(error));

app.listen(PORT, HOST, () => {
  console.log(`Server is listening on ${HOST}:${PORT}`);
});

