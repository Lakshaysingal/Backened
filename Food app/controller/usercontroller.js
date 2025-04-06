const user=require('../models/userschema');


exports.register=async(req,res)=>{
    try{

        const {username,email,password,mobno,address}=req.body;

        if(!username || !email || !password ||!mobno || !address){
            return res.status(500).send("please provide all details");
        }
        const existinguser=await user.findOne({email});

        if(existinguser){
            return res.status(500).send("user already exists");
        }

        const newuser =await user.create({username,email,password,address,mobno});
        res.status(201).json({ message: "Successfully registered", user: newuser  });
    }
    catch (error) { 
        console.error(error); 
        res.status(500).json({ error: error.message });
    }
    
}