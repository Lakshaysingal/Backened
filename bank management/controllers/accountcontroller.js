const Accountholder=require("../models/account");

const sendEmail=require("../config/mailer");



exports.createaccount=async(req,res)=>{

    try{
    const {accno,name,email,mobno,balance}=req.body;
    const newacc=new Accountholder({accno,name,email,mobno,balance});
    await newacc.save();
    await sendEmail(newacc.email,"Welcome to HM Finance",`current balance Rs.${newacc.amount}`);
    res.status(201).send("Account added scuucesfully");
          
            }
            catch(error){
              console.log("error",error);
              res.status(400).send("error"+error.message);
            }
};


exports.getaccountbyid=async(req,res)=>{
  try{
    const accno=req.params.accno;
    const accholder=  await Accountholder.findOne({accno});

    if(!accholder){
      return res.status(404).send("no account")
    }
    res.status(200).send(accholder);
}
catch(error){
  console.log("error"+error);
    res.status(400).send(error.message);
}
};


exports.getaccount=async(req,res)=>{
  
    try{
        
        const accholder=  await Accountholder.find();
  
        res.status(200).send(accholder);
    }
    catch(error){
      console.log("error"+error);
        res.status(400).send(error.message);
    }
  };


exports.updateaccount=async(req,res)=>{
  try {
    const accno = req.params.accno;
    const { name, email, mobno, balance } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (mobno) updateFields.mobno = mobno;
    if (balance) updateFields.balance = balance;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send("Nothing to update: No fields provided");
  }
   const updatedAccount = await Accountholder.findOneAndUpdate(
      { accno },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return res.status(404).send("Account not found");
    }

    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};


exports.deposit=async(req,res)=>{
 try{
        const accno=req.params.acc;
        const {amount} =req.body;
  
        
  
        if (!amount || amount <= 0) {
          return res.status(400).send("Invalid deposit amount");
        }
  
        const depositmoney= await Accountholder.findOneAndUpdate({accno},
          {$inc: {balance:amount},$push:{transactions:{type:"Deposit",amount,date:new Date() }}},
        {new :true, runValidators:true} 
        );
  
        if (!depositmoney) {
          return res.status(404).send("Account not found");
        }
  
        await sendEmail(
          depositmoney.email,
          "Deposit Successfull",
          `Dear ${depositmoney.name},\n\n You have successfully deposited Rs ${amount} into your account .\n \nCurrent Balance: ${depositmoney.balance}.\n\nThanks for using our service \n\n Regards \n\n HM FINANCE `
        
        );
        res.status(200).json({ message: "Deposit successful",Amountdeposited:amount, newBalance: depositmoney.balance });
      
  }
    catch(error){
      res.status(500).send("Error: " + error.message);
    }
  
};

exports.withdraw=async(req,res)=>{
  try{
    const accno=req.params.acc;
    const {amount} =req.body;

    
    const account = await Accountholder.findOne({ accno });

    if (!amount || amount <= 0) {
      return res.status(400).send("Invalid witdraw amount");


    }
    if (!account) {
      return res.status(404).send("Account not found");
    }
    if (account.balance < amount) return res.status(400).json({ error: "insufficient balance" });



    
    const withdrawmoney= await Accountholder.findOneAndUpdate({accno},
      {$inc: {balance:-amount},$push:{transactions:{type:"withdraw ",amount,date:new Date() }}},
    {new :true, runValidators:true} 
    );

    await sendEmail(
      account.email,
      "Withdrawal Alert",
      `Dear ${account.name},\n\nYou have withdrawn ${amount} from your account.\nCurrent Balance :${withdrawmoney.balance}\n\nThanks for using our service \n\n Regards \n\n HM FINANCE`
    );


    
    
    res.status(200).json({ message: "withdraw successful",Amountwithdraw:amount, newBalance: withdrawmoney.balance });
  
}
catch(error){
  res.status(400).send("Error: " + error.message);
}
};






