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
  paymentStripe
} = require("../controllers/user");

router.get("/:userId",getUser)

router.post("/signup",signup)

router.post("/login",login)

router.post("/change-password",verifyToken,changePassword)

router.post("/google-login",googleLogin)

router.post("/change-username",verifyToken,changeUsername)

router.delete("/delete-account/:userId",verifyToken,deleteUserAcc)

router.post("/checkout",verifyToken,paymentStripe)


module.exports=router