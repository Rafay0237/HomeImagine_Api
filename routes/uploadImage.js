const express=require("express")
const multer = require("multer");

const {uploadImageDp ,uploadImageChat}=require("../controllers/uploadImage")

const router=express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/dp",upload.fields([{ name: "image" }, { name: "id" }]),uploadImageDp)

router.post("/chat",upload.fields([{ name: "image" }, { name: "id" }]),uploadImageChat)

module.exports=router