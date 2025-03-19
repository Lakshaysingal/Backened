const mongoose=require('mongoose');


const connectdb= async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/Bank");
        console.log("connected");
          
    }

    catch(error){
        console.error("DB Connection Error:", err);
        process.exit(1);
    }
}


module.exports=connectdb;