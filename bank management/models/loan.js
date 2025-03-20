const mongoose = require("mongoose");



const loandata = new mongoose.Schema({
  accno: { type: String, required: true },
  loantype:{type:String,required:true,enum:['home','personal','education','car','gold'],default:'personal'},
  amount: { type: Number, required: true },
  interestrate: { type: Number, required:true },  
  tenure: { type: Number, required: true }, 
  emi: { type: Number, required: true ,set: v => parseFloat(v.toFixed(2))},
  remainingBalance: { type: Number, required: true,set: v => parseFloat(v.toFixed(2)) },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending','approved', 'rejected','closed'], default: 'pending' }
});



const Loanholder = mongoose.model("Loan", loandata);
module.exports = Loan;



