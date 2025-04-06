const express=require("express");
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB=require('./config/db');
const userroutes=require('./routes/userroutes');



const app=express();
connectDB();

dotenv.config();

app.use(cors());
app.use(express.json());
app.get('/',async(req,res)=>{
    res.status(200).send("Food app");
})

app.use("/user",userroutes);

const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`server on ${PORT} `);
    console.log("Food order app");
})