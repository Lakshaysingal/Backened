const mongoose=require('mongoose');
const dotenv=require('dotenv');

dotenv.config();

const connectDB= async() =>{
    try{
         await mongoose.connect(process.env.MONGO_URL)
         console.log("db connect");
    }
    catch(error){
        console.log(" db error",error); 
    }
}

module.exports=connectDB;