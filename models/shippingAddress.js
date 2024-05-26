const mongoose =require("mongoose")

const shippingAddressSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    email:{
        type: String,
        min:[10,"Too Short Email"],
        max:[20,"Too long email"],
        required:true
    },
    fullName:{
        type: String,
        min:[4,"Too Short username"],
        max:[16,"Too long username"],
        required:true
    },
    address:{
        type: String,
        min:[8,"Too Short Password"],
        max:[20,"Too long Password"],
        required:true
    },
    city:{
        type:String,
        required:true
    },
    phoneNu:{
        type:String,
        required:true
    },
    houseNu:{
        type:String,
        required:true
    }
})

const ShippingAddress=new mongoose.model("shippingAddress",shippingAddressSchema)

module.exports=ShippingAddress;

