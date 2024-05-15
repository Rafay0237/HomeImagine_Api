const Conversations=require("../models/conversation")
const Messages=require("../models/message")

let getConversation = async (req, res) => {
    try {
      let conversation = await Conversations.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).send({ conversation });
    } catch (err) {
      res.status(400).send({ error: err });
    }
  };
  
  let saveMessage = async (req, res) => {
    const message = Messages(req.body);
    try {
      const savedMessage = await message.save();
      res.status(200).send({ savedMessage });
    } catch (err) {
      res.status(400).send({ error: err });
    }
  };
  
  let getMessages = async (req, res) => {
    try {
      const messageList = await Messages.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).send({ messageList });
    } catch (err) {
      res.status(400).send({ error: err });
    }
  };
  
  let removeFreind = async (req, res) => {
    let conversationId=req.params.conversationId
      try {
        let deletedConvo = await Conversations.deleteOne({
          _id:conversationId, 
        });
        if(deletedConvo.deletedCount==0){
       return res.status(404).send({message:"Conversation not found!",deleted:false})
        }
        res.status(200).send({ deletedConvo ,deleted:true});
      } catch (err) {
        res.status(400).send({ message: err ,deleted:false});
      }
    };

  let ClearChat = async (req, res) => {
    let conversationId=req.params.conversationId
    try {
      const deletedChat = await Messages.deleteMany({conversationId});
      if(deletedChat.deletedCount==0){
        return  res.status(404).send({message:"Chat not found!" ,deleted:false });
      }
      res.status(200).send({ deletedChat,deleted:true });
    } catch (err) {
      res.status(400).send({ message: err,deleted:false });
    }
  };
  
  module.exports={getConversation,removeFreind,saveMessage,getMessages,ClearChat}