const mongoose = require("mongoose");



const loandata = new mongoose.Schema({
  accno: { type: String, required: true},
  loantype:{type:String,required:true,enum:['home','personal','education','car','gold','business'],default:'personal'},
  amount: { type: Number, required: true },
  incomePerAnnum: { type: Number, required: true },
  interestrate: { type: Number, required:true },  
  tenure: { type: Number, required: true }, 
  tenuretype:{type:String,enum:['months', 'years'], default: 'months'},
  emi: { type: Number, required: true ,set: v => parseFloat(v.toFixed(2))},
  remainingBalance: { type: Number, required: true,set: v => parseFloat(v.toFixed(2)) },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending','approved', 'rejected','closed'], default: 'pending' }
});




loandata.methods.calculateEMI = function () {
  let P = this.amount; 
  let annualRate = this.interestrate; 
  let N = this.tenure; 

  
  if (this.tenuretype === 'years') {
    N *= 12;
  }

  let r = (annualRate / 12) / 100;

 

  
  let emi = (P * r * Math.pow(1 + r, N)) / 
            (Math.pow(1 + r, N) - 1);

  return parseFloat(emi.toFixed(2));
};




const Loanholder = mongoose.model("Loan", loandata);
module.exports = Loanholder;



