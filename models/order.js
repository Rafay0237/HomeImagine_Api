const mongoose = require("mongoose")

const orderSchema= new mongoose.Schema({
    cartItems:{
        type:Array,
        required:true
    },
    productsQty:{
        type:Number,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    }
},{timestamps:true})

const Order= new mongoose.model("order",orderSchema)

module.exports=Order