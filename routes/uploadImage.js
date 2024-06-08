const express=require("express")
const multer = require("multer");

const {uploadImageDp ,uploadImageChat,uploadImageAndProject,uploadSliderImage}=require("../controllers/uploadImage")

const router=express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/dp",upload.fields([{ name: "image" }]),uploadImageDp)

router.post("/chat",upload.fields([{ name: "image" }]),uploadImageChat)

router.post("/project",upload.fields([{ name: "image" }]),uploadImageAndProject)

router.post("/slider",upload.fields([{ name: "image" }]),uploadSliderImage)

module.exports=router