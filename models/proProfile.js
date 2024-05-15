const mongoose= require("mongoose")

const proProfileSchema= new mongoose.Schema({

userId:{
    type:String,
    required:true
},
firmName:{
    type:String,
    min:[5,"Too Short Firm Name"],
    max:[20,"Too Long Firm Name"]
},
fullName:{
    type:String,
    min:[5,"Too Short fullName "],
    max:[20,"Too Long fullName "]
},
descTitle:{
    type:String,
    min:[10,"Too Short heading for Description"],
    max:[60,"Too Long heading for Description"]
},
desc:{
    type:String,
    min:[20,"Too Short Description"],
    max:[300,"Too Long Description"]
},
address:{
    type:String,
},
phoneNumber:{
    type:String,
},
website:{
    type:String,
},
insta:{
    type:String,
},
facebook:{
    type:String,
},
rating:{
    type:Object,
    default:{
        stars:0,
        reviewCount:0
    }
},
bgImg:{
    type:String,
    default:"https://www.houzz.com/pro/webuser-356709784/jason-katsikas"
},
sliderImages:{
    type:Array,
    default:["https://www.houzz.com/pro/webuser-356709784/jason-katsikas"]
},
logo:{
    type:String,
    default:"https://th.bing.com/th?id=OIP.vpU_KUELPRjvDl4PvY0xIAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
},
awards:{
    type:String,
    max:[100,"Too Long Description"]
},
services:{
    type:String,
    max:[100,"Too Long Description"]
},
areasServiced:{
    type:String,
    max:[100,"Too Long Description"]
},
from:{
    type:Number,
    required:true
},
to:{
    type:Number,
    required:true
},
costDesc:{
    type:String,
    max:[100,"Too Long Description"]
},
})

const proProfile=new mongoose.model("proProfile",proProfileSchema)

module.exports=proProfile