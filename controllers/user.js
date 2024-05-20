const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const secret = process.env.SECRET;

let signup = async (req, res) => {
  let { userName, password, email } = req.body;
  try {
    const emailExist = await Users.findOne({ email });
    if (emailExist)
      return res.status(200).send({ message: "Email already exists" });

    const userNameExist = await Users.findOne({ email });
    if (userNameExist)
      return res.status(200).send({ message: "Username already exists" });

    const hashedPassowrd = await bcrypt.hash(password, 9);

    const user = new Users({ userName, email, password: hashedPassowrd });
    const savedUser = await user.save();
    user.password = undefined;

    res.status(200).send({ savedUser, success: true });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

let login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await Users.findOne({ email });
    if (!user)
      return res
    .status(404)
    .send({ message: "No email id exists with this name" ,success:false});
    
    let verifyPassword = await bcrypt.compare(password, user.password);
    console.log(verifyPassword)
    if (!verifyPassword)
      return res.status(400).send({ message: "invalid password" ,success:false});

    const token = jwt.sign({ id: user._id, role: "user" }, secret, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    user.password = undefined;
    res.status(200).send({ user, success: true, token });
  } catch (error) {
    console.log(error)
    res.status(500).send({ error ,success:false});
  }
};

let changePassword = async (req, res) => {
  let { email, password, newPassword } = req.body;
  const user = await Users.findOne({ email });
  if (user) return res.status(404).send({ message: "user not found!" });
  let verifyPassword = bcrypt.compare(password, user.password);
  if (!verifyPassword)
    return res.status(400).send({ message: "Current Password is Inavlid!" });

  let hashedPassword = bcrypt.hash(newPassword, 9);
  await updateOne({ email }, { $set: { password: hashedPassword } });
  res
    .status(200)
    .send({ message: "Password is Updated Successfully!", success: true });
};

let changeUsername = async (req, res) => {
  const newName = req.body.userName;

  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not Found!" });
    }

    const userNameExist = await Users.findOne({ userName: newName });
    if (userNameExist) {
      return res.status(404).send({ message: "Username already Exists!" });
    }
    await Users.updateOne(
      { email: req.body.email },
      { $set: { userName: newName } }
    );

    res
      .status(200)
      .send({ message: "Username changed Successfully! ", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

let googleLogin = async (req, res) => {
  const { userName, email, photo } = req.body;
  try {
    const user = await findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id, role: "user" }, secret, {
        algorithm: "HS256",
        expiresIn: "7d",
      });
      user.password = undefined;
      res
        .status(200)
        .send({ message: "Logged in with Google", success: true, token });
    } else {
      let randomPassword = Math.random().toString(36).slice(-8);
      let hashedPassowrd = await bcrypt.hash(randomPassword, 9);
      const user = new Users({
        email,
        userName,
        password: hashedPassowrd,
        profilePicture: photo,
      });
      await user.save();
      res.status(200).send({ message: "Signed Up with Google", success: true });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

let verifyToken = async (req, res,next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
    console.log(token)
  if (!token)
    return res
      .status(404)
      .send({ message: "Unauthorized User! Token not Found", success: false });

  try {
    const decodedToken =  jwt.verify(token, secret);
    if (!decodedToken)
      return res
        .status(400)
        .send({ message: "Unauthorized User! Token expired", success: false });
    next();
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error });
  }
};

let deleteUserAcc = async (req, res) => {
  try {
    const id = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ message: "Invalid user ID", success: false });
    }
    const user = await Users.deleteOne({ _id: id });
    if (user.deletedCount == 0) {
      return res
        .status(404)
        .send({ message: "No user against this id", success: false });
    }
    res.status(200).send({user,success:true});
  } catch (error) {
    res.status(500).send({ error: error.toString() ,success:false});
  }
};

let getUser = async (req, res) => {
  let userId=req.params.userId
  try {
    const user = await Users.findOne({_id:userId});
    res.status(200).send({user});
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  googleLogin,
  verifyToken,
  changeUsername,
  deleteUserAcc,
  getUser
};
