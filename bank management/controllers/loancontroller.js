const Loanholder=require("../models/loan");
const Accountholder=require("../models/account");


const getInterestRate = (loanType) => {
    const interestRates = {
      home: 3.5,        
      personal: 12,     
      car: 9,          
      education: 5     
    };
  
    return interestRates[loanType] || 12;
  };



exports.applyloan =async(req,res)=>{
    try{
        const {accno,loantype,amount,tenure}=req.body;
        const account=await Accountholder.findOne({accno});
    
        if(!account)return res.status(404).send("Account not found");
    
        const interestrate=getInterestRate(loantype);
    
       
    
        const emi = (amount * (interestrate/100)) / (1 - Math.pow(1 + (interestrate/100), -tenure));
    
    
        const newLoan = new Loanholder({
          accno,
          loantype,
          amount,
          interestrate,
          tenure,
          emi: emi,
          remainingBalance: amount,
          status: 'pending'
      });
    
      await newLoan.save();
      res.status(201).json({ message: "Loan application submitted successfully.", loan: newLoan });
    
      }
      catch(error){
        res.status(500).send("Error: " + error.message);
      }
};