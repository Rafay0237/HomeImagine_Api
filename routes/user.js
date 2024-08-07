const express=require("express")
const router=express.Router()
const {
  getUser,
  signup,
  login,
  changePassword,
  googleLogin,
  verifyToken,
  changeUsername,
  deleteUserAcc,
  paymentCartStripe,
  CashOnDelivery,
  getUsersOrders,
  getOrderDetails,
  paymentProStripe,
} = require("../controllers/user");

router.get("/:userId",getUser)

router.post("/signup",signup)

router.post("/login",login)

router.post("/change-password",verifyToken,changePassword)

router.post("/google-login",googleLogin)

router.post("/change-username",verifyToken,changeUsername)

router.delete("/delete-account/:userId",verifyToken,deleteUserAcc)

router.post("/checkout",verifyToken,paymentCartStripe)

router.post("/pro-payment",verifyToken,paymentProStripe)

router.post("/order-save",verifyToken,CashOnDelivery)

router.get("/orders/:userId",getUsersOrders)

router.get("/order-detail/:id",getOrderDetails)


module.exports=router