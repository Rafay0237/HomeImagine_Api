const Users = require("../models/user");
const Order = require("../models/order");
const Contract = require("../models/contract");
const Payment =require("../models/payment")
const ShippingAddress = require("../models/shippingAddress");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer=require("nodemailer")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const secret = process.env.SECRET;

const transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
      user:"abdulrafayakb1515@gmail.com",
      pass :"shpc mwiq xvcp ojml",
  }
})

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
        .send({ message: "No email id exists with this name", success: false });

    let verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword)
      return res
        .status(400)
        .send({ message: "invalid password", success: false });

    const token = jwt.sign({ id: user._id, role: "user" }, secret, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    user.password = undefined;
    res.status(200).send({ user, success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error, success: false });
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
    const user = await Users.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id, role: "user" }, secret, {
        algorithm: "HS256",
        expiresIn: "7d",
      });
      user.password = undefined;
      res
        .status(200)
        .send({user, message: "Logged in with Google", success: true, token });
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
      res.status(200).send({ user,message: "Signed Up with Google", success: true });
    }
  } catch (error) {
    res.status(500).send({ message:error.message ,success:false});
  }
};

let verifyToken = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token)
    return res
      .status(404)
      .send({ message: "Unauthorized User! Token not Found", success: false });

  try {
    const decodedToken = jwt.verify(token, secret);
    if (!decodedToken)
      return res
        .status(400)
        .send({ message: "Unauthorized User! Token expired", success: false });
    next();
  } catch (error) {
    console.log(error);
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
    res.status(200).send({ user, success: true });
  } catch (error) {
    res.status(500).send({ error: error.toString(), success: false });
  }
};

let getUser = async (req, res) => {
  let userId = req.params.userId;
  try {
    const user = await Users.findOne({ _id: userId });
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};


let paymentCartStripe = async (req, res) => {
  let {userId, cartItems, productsQty, totalAmount}  = req.body;
  let lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.title,
        images: [item.img],
      },
      unit_amount: item.price,
    },
    quantity: item.qty,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173" + "/payment-success",
      cancel_url: "http://localhost:5173" + "/payment-cancelled",
    });

   let order= await storeOrder(userId, cartItems, productsQty, totalAmount);

    res.json({ id: session.id, success: true,order });
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: error.message, success: false });
  }
};


let paymentProStripe = async (req, res) => {
  let {totalAmount,proId,contractId,userId}  = req.body;
  try{

  const pro = await Users.findOne({_id:proId})
  if(!pro){
  return res.status(400).send({ message:"Cannot Find Pro", success: false });
  }

  const user = await Users.findOne({_id:proId})
  if(!user){
  return res.status(400).send({ message:"Cannot Find User", success: false });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Contract Payment for Pro ID: ${pro.userName}`,
            images: [pro.profilePicture]
          },
          unit_amount: totalAmount*100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:5173/payment-success",
    cancel_url: "http://localhost:5173/payment-cancelled",
  });

  const payment = new Payment({
    contractId,
    totalAmount,
    ratingGiven:false,
    proName:pro.userName,
    proDp:pro.profilePicture,
    proId:pro._id,
    userId,
    userDp:user.profilePicture,
    userName:user.userName
  });
  
   await payment.save()

   await Contract.findByIdAndDelete(contractId);

  res.json({ id: session.id,message:"Payment Process Completed", success: true });

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: error.message, success: false });
  }
};


const storeOrder = async (userId, cartItems, productsQty, totalAmount) => {
  try {
    const order = new Order({
      userId,
      cartItems,
      productsQty,
      totalAmount
    });

    const orderSaved=await order.save();

    const userDetails = await ShippingAddress.findOne({userId})
    
      await transporter.sendMail({
      from:"abdulrafayakb1515@gmail.com",
      to:userDetails.email,
      subject:"Oder Placed",
      html: `
      <p>Hello from Home Imagine, ${userDetails.fullName},</p>
      <p>Your order will be received in 2-3 days at the following address:</p>
      <p>${userDetails.address}</p>
      <p>Thank you for shopping with us!</p>
      <img src="https://static.vecteezy.com/system/resources/previews/000/101/522/large_2x/vector-delivery-man.jpg" alt="Image">
    `,
     })

    return orderSaved
  } catch (error) {
    console.error(error.message);
  }
};


const CashOnDelivery = async(req,res)=>{
  let {userId, cartItems, productsQty, totalAmount}  = req.body;
  let orderSaved=storeOrder(userId, cartItems, productsQty, totalAmount)
  if(!orderSaved){
    return res.status(400).send({orderSaved,success:false})
  }
  res.status(200).send({order:orderSaved,success:true})
}


const getUsersOrders = async (req, res) => {
  try {
      const { userId } = req.params;

      const orders = await Order.find({ userId }).exec();

      if (!orders.length) {
          return res.status(404).json({ found: false, message: 'No orders found for this user' });
      }

      res.status(200).json({ found: true, orders });
  } catch (error) {
      res.status(500).json({ found: false, message: error.message });
  }
};


const getOrderDetails = async (req, res) => {
  try {
      const { id } = req.params;

      const order = await Order.findOne({ _id:id })

      if (!order) {
          return res.status(404).json({ found: false, message: 'No order found' });
      }

      res.status(200).json({ found: true, order });
  } catch (error) {
      res.status(500).json({ found: false, message: error.message });
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
  getUser,
  paymentCartStripe,
  CashOnDelivery,
  getUsersOrders,
  getOrderDetails,
  paymentProStripe
};
