const mongoose=require("mongoose");






const bankdata=new mongoose.Schema({
    accno:{type:String,required:true,unique: true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique: true},
    mobno:{type:String,required:true,unique:true},
    balance:{type:Number,required:true,set: v => parseFloat(v.toFixed(2)) },
    transactions:[{type:  Object}],
    createdAt: { type: Date, default: Date.now },
    

    
});



const Accountholder =mongoose.model("BANK",bankdata);

module.exports=Accountholder;