const mongoose=require("mongoose")

const MessageSchema=new mongoose.Schema({
conversationId:{
    type:String
},
sender:{
    type:String
},
text:{
    type:String
},
seen:{
 type:Boolean,
 default:false
},
img:{
    type:String
}
},{timestamps:true})

 const Messages=mongoose.model("messages",MessageSchema)

 module.exports=Messages