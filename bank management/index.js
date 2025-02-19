const express=require('express');
const cors=require('cors');
const mongoose=require("mongoose");


const app=express();

app.use(express.json());
app.use(cors());



mongoose.connect("mongodb://localhost:27017/Bank")
  .then(() => console.log("connected"))
  .catch((err) => console.log("error to connect"));

const bankdata=new mongoose.Schema({
    accno:{type:String,required:true,unique: true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique: true},
    mobno:{type:String,required:true,unique:true},
    balance:{type:Number,required:true}


    
});



const Accountholder =mongoose.model("BANK",bankdata);


app.get('/',(req,res)=>{
  res.send("hello world");
})

app.post('/addaccount',async(req,res)=>{
  try{
    const {accno,name,email,mobno,balance}=req.body;
    const newacc=new Accountholder({accno,name,email,mobno,balance});
    await newacc.save();
    res.status(201).send("Account added scuucesfully");

  }
  catch(error){
    console.log("error",error);
    res.status(400).send("error"+error.message);
  }
});







app.listen(3000,()=>{
  console.log(`server running on http://localhost:${3000}`);
});





