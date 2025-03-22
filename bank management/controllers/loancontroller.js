const Loanholder=require("../models/loan");
const Accountholder=require("../models/account");


const getInterestRate = (loanType) => {
    const interestRates = {
      home: 3.5,        
      personal: 12,     
      car: 9,          
      education: 5 ,
      business : 13
    };
  
    return interestRates[loanType] || 12;
  };



// exports.applyloan =async(req,res)=>{
//     try{
//         const {accno,loantype,amount,tenure,tenuretype}=req.body;
//         const account=await Accountholder.findOne({accno});
    
//         if(!account)return res.status(404).send("Account not found");
    
//         const interestrate=getInterestRate(loantype);
    
//         const existingLoan = await Loanholder.findOne({
//           accno,
//           loantype,
//           status: { $in: ['pending', 'approved'] } // Only check for non-closed loans
//       });

//       if (existingLoan) {
//           return res.status(400).json({ message: `You already have an active ${loantype} loan.` });
//       }
    
        
    
    
//         const newLoan = new Loanholder({
//           accno,
//           loantype,
//           amount,
//           interestrate,
//           tenure,
//           tenuretype,
//           remainingBalance: amount,
//           status: 'pending'
//       });

//       newLoan.emi=newLoan.calculateEMI();
    
//       await newLoan.save();
//       res.status(201).json({ message: "Loan application submitted successfully.", loan: newLoan });
    
//       }
//       catch(error){
//         res.status(500).send("Error: " + error.message);
//       }
// };


exports.applyloan = async (req, res) => {
  try {
      const { accno, loantype, amount, tenure, incomePerAnnum } = req.body;
      const account = await Accountholder.findOne({ accno });

      if (!account) return res.status(404).send("Account not found");

      const interestrate = getInterestRate(loantype);

      
      let maxLoanAmount = 50000000; 
      if (account.accountType === 'savings') maxLoanAmount = 1000000; 
      if (account.accountType === 'business' && account.balance < 500000) {
          return res.status(400).send("Business accounts must have ₹5 lakh balance for loan.");
      }

      if (amount > maxLoanAmount) {
          return res.status(400).send(`Loan limit exceeded for ${account.accountType} account.`);
      }

      
      const newLoan = new Loanholder({
          accno,
          loantype,
          amount,
          incomePerAnnum,
          interestrate,
          tenure,
          remainingBalance: amount,
          status: 'pending' 
      });

      // 🏦 Calculate EMI
      newLoan.emi = newLoan.calculateEMI();

      
    

      await newLoan.save();
      res.status(201).json({ message: `Loan ${newLoan.status} successfully.`, loan: newLoan });

  } catch (error) {
      res.status(500).send("Error: " + error.message);
  }
};


exports.reviewLoan = async (req, res) => {
  try {
      const { loanId } = req.params;
      const loan = await Loanholder.findById(loanId);
      if (!loan) return res.status(404).json({ message: "Loan not found" });

      const account = await Accountholder.findOne({ accno: loan.accno });
      if (!account) return res.status(404).json({ message: "Account not found" });

      // 1️⃣ Minimum Balance Check (20% of loan amount)
      const requiredBalance = loan.amount * 0.2;
      if (account.balance < requiredBalance) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: "Loan rejected: Insufficient balance." });
      }

      // 2️⃣ Credit Score Check
      if (account.creditScore < 500) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: "Loan rejected: Poor credit score." });
      } else if (account.creditScore >= 750) {
          loan.status = "approved"; // Auto-approve for excellent credit score
      }

      // 3️⃣ Existing Loan Check (Same Type)
      const existingLoan = await Loanholder.findOne({ 
          accno: loan.accno, 
          loantype: loan.loantype, 
          status: { $in: ["pending", "approved"] } 
      });
      if (existingLoan) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: "Loan rejected: Active loan of this type already exists." });
      }

      // 4️⃣ EMI Affordability Check (40% of Monthly Income)
      const monthlyIncome = account.incomePerAnnum / 12;
      if (loan.emi > (monthlyIncome * 0.4)) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: "Loan rejected: EMI exceeds 40% of monthly income." });
      }

      // 5️⃣ Debt-to-Income Ratio Check (Total EMI ≤ 50% of Monthly Income)
      const totalEMI = await Loanholder.aggregate([
          { $match: { accno: loan.accno, status: "approved" } },
          { $group: { _id: null, totalEmi: { $sum: "$emi" } } }
      ]);
      const currentEMI = totalEMI.length > 0 ? totalEMI[0].totalEmi : 0;

      if ((currentEMI + loan.emi) > (monthlyIncome * 0.5)) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: "Loan rejected: Total EMI exceeds 50% of monthly income." });
      }

      // 6️⃣ Employment Status Check
      if (!["employed", "self-employed"].includes(account.employmentStatus)) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: "Loan rejected: Employment status not eligible." });
      }

      // 7️⃣ Loan Tenure Restrictions Based on Loan Type
      const maxTenures = {
          home: 360, // 30 years
          personal: 60, // 5 years
          car: 84, // 7 years
          education: 120, // 10 years
          gold: 36, // 3 years
          business: 180 // 15 years
      };

      if (loan.tenure > maxTenures[loan.loantype]) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: `Loan rejected: Maximum tenure exceeded for ${loan.loantype} loan.` });
      }

      // 8️⃣ Minimum Annual Income Requirement (For Large Loan Amounts)
      if (loan.amount > 5000000 && account.incomePerAnnum < 1000000) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: "Loan rejected: Minimum annual income requirement not met for high-value loans." });
      }

      // 9️⃣ Account Type Eligibility (Savings vs. Current vs. Business)
      if (account.accountType === "savings" && loan.amount > 5000000) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: "Loan rejected: Savings accounts have a maximum loan limit of 50 lakh." });
      }
      if (account.accountType === "business" && loan.amount < 500000) {
          loan.status = "rejected";
          await loan.save();
          return res.status(400).json({ message: "Loan rejected: Business accounts must apply for loans above ₹5 lakh." });
      }

      // If all conditions are met, approve the loan
      loan.status = "approved";
      await loan.save();

      return res.status(200).json({ message: "Loan approved successfully.", loan });

  } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
  }
};
