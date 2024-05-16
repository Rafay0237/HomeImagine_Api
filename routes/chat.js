const express=require("express")
const router=express.Router()

const {getConversation,removeFreind,saveMessage,getMessages,ClearChat,UpdateSeen}=require("../controllers/chat")

router.get("/conversation/:userId",getConversation)

router.get("/messages/:conversationId",getMessages)

router.post("/messages",saveMessage)

router.delete("/messages/:conversationId",ClearChat)

router.delete("/conversation/:conversationId",removeFreind)

router.put("/messages/update-seen",UpdateSeen)

module.exports=router