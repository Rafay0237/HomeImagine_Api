const express=require("express")
const multer = require("multer");

const {uploadImageDp ,uploadImageChat,uploadImageAndProject}=require("../controllers/uploadImage")

const router=express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/dp",upload.fields([{ name: "image" }]),uploadImageDp)

router.post("/chat",upload.fields([{ name: "image" }]),uploadImageChat)

router.post("/project",upload.fields([{ name: "image" }]),uploadImageAndProject)

module.exports=router