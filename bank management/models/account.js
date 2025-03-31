const mongoose=require("mongoose");
const moment=require("moment");

const bankdata=new mongoose.Schema({
    username: { type: String, required: true, unique: true  ,ref: "user"},
    accno:{type:String,required:true,unique: true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique: true},
    mobno:{type:String,required:true,unique:true},
    balance:{type:Number,required:true, min: 0,set: v => parseFloat(v.toFixed(2)) },
    accounttype: { 
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
    

    
    createdAt: { type: Date, default: Date.now },
    

    
});



const generateCardNumber = () => {
  return "4" + Math.random().toString().slice(2, 16);
};
bankdata.pre("save", function (next) {
  if (!this.debitCard || !this.debitCard.cardNumber) {
    this.debitCard = {
      cardNumber: generateCardNumber(),
      expiryDate: moment().add(5, "years").format("MM/YY"),
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      isActive: true
    };
  }
  next();
});



















const Accountholder =mongoose.model("BANK",bankdata);

module.exports=Accountholder;