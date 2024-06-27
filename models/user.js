const mongoose =require("mongoose")

const userSchema= new mongoose.Schema({
    email:{
        type: String,
        min:[10,"Too Short Email"],
        max:[20,"Too long email"]
    },
    userName:{
        type: String,
        min:[4,"Too Short username"],
        max:[16,"Too long username"]
    },
    password:{
        type: String,
        min:[6,"Too Short Password"],
        max:[20,"Too long Password"]
    },
    profilePicture:{
        type:String,
        default:"https://th.bing.com/th?id=OIP.vpU_KUELPRjvDl4PvY0xIAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2" 
    }
})

const Users=new mongoose.model("users",userSchema)

module.exports=Users;

