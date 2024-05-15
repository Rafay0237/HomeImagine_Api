const express=require("express")
const router=express.Router()

const {getConversation,removeFreind,saveMessage,getMessages,ClearChat}=require("../controllers/chat")

router.get("/conversation/:userId",getConversation)

router.get("/messages/:conversationId",getMessages)

router.post("/messages",saveMessage)

router.delete("/messages/:conversationId",ClearChat)

router.delete("/conversation/:conversationId",removeFreind)

module.exports=router