const mongoose=require('mongoose');
const dotenv=require('dotenv');


const userdata=new mongoose.Schema({
    username:{type:String,required:[true,'user name is required']},
    email:{type:String ,required:[true,'emai; is required'],unique:true},

    password:{type:String ,required:[true,'pass is required']},
    address:{type:Array},
    mobno:{type:String,required:[true,'mobno is required']},

    usertype:{type:String,enum:['client','vendor','admin','driver'],default:'client'},

    profile:{type:String,default:''}

},{timestamps:true});




module.exports=mongoose.model('user',userdata);
