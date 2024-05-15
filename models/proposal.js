const mongoose = require("mongoose")

const proposalSchema= new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    senderId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String
    },
    message:{
        type:String,
        required:true
    },
})

const Proposals= new mongoose.model("proposals",proposalSchema)

module.exports=Proposals
