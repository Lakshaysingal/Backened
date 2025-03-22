const mongoose=require("mongoose");
const moment=require("moment");







const bankdata=new mongoose.Schema({
    accno:{type:String,required:true,unique: true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique: true},
    mobno:{type:String,required:true,unique:true},
    balance:{type:Number,required:true,set: v => parseFloat(v.toFixed(2)) },
    accountType: { 
        type: String, 
        required: true, 
        enum: ['savings', 'current', 'salary', 'business'], 
        default: 'savings' 
      },
      debitCard: {
        cardNumber: { type: String, unique: true, sparse: true }, 
        expiryDate: { type: String },
        cvv: { type: String },
        isActive: { type: Boolean, default: false }
      },
      creditCard: {
        cardNumber: { type: String, unique: true, sparse: true },
        creditLimit: { type: Number, default: 0 }, 
        usedCredit: { type: Number, default: 0 }, 
        expiryDate: { type: String },
        cvv: { type: String },
        isActive: { type: Boolean, default: false }
      },
    

    transactions:[{type:  Object}],
    createdAt: { type: Date, default: Date.now },
    

    
});







const Accountholder =mongoose.model("BANK",bankdata);

module.exports=Accountholder;