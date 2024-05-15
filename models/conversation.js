const mongoose= require("mongoose")

const conversationsSchema= new mongoose.Schema({
members:{
    type:Array,
    required:true
}
},{
    timestamps: true
})

const Conversations=new mongoose.model("conversations",conversationsSchema)

module.exports=Conversations