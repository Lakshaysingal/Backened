const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");


const app=express();

app.use(express.json());
app.use(cors());



mongoose.connect("mongodb://localhost:27017/Bank")
  .then(() => console.log("connected"))
  .catch((err) => console.log("error to connect"));

const studentdata=new mongoose.Schema({
    accno:{type:String,required:true,unique: true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique: true},
    mobno:{type:String,required:true,unique:true},
    balance:{type:String,required:true}


    
});



