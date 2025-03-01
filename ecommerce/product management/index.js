const express=require('express');
const mongoose=require("mongoose");


const app=express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("connected"))
  .catch((err) => console.log("error to connect"));



const productdetails=new mongoose.Schema({
    name:String,
    price:Number,
    description:String,
    category:String,
    stock:Number,

});



const product =mongoose.model("Product",productdetails);


app.get('/',async(req,res)=>{
    res.send("E-commerce");
});

app.listen(5000,()=>{
    console.log(`ecommerce live on port ${5000}`);
})

