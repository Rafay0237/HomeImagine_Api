const mongoose = require("mongoose")

const productSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    reviewCount:{
        type:String
    },
    category:{
        type:String,
        required:true
    },
})

const Products= new mongoose.model("products",productSchema)

module.exports=Products