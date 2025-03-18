const express=require('express');
const cors=require('cors');
const mongoose=require("mongoose");
const nodemailer=require('nodemailer');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const PDFDocument = require('pdfkit');
const path=require('path');
const schedule=require('node-schedule');
const moment=require('moment');


const app=express();

app.use(express.json());
app.use(cors());



mongoose.connect("mongodb://localhost:27017/Bank")
  .then(() => console.log("connected"))
  .catch((err) => console.log("error to connect"));

const bankdata=new mongoose.Schema({
    accno:{type:String,required:true,unique: true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique: true},
    mobno:{type:String,required:true,unique:true},
    balance:{type:Number,required:true,set: v => parseFloat(v.toFixed(2)) },
    transactions:[{type:  Object}],
    
    

    
});

const loandata = new mongoose.Schema({
  accno: { type: String, required: true },
  loantype:{type:String,required:true,enum:['home','personal','education','car','gold'],default:'personal'},
  amount: { type: Number, required: true },
  interestRate: { type: Number, required:true },  
  tenure: { type: Number, required: true }, 
  emi: { type: Number, required: true },
  remainingBalance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending','approved', 'rejected','closed'], default: 'pending' }
});


const getinterestrate=(loantype)=>{
  const rate={
    home: 0.035,       
    personal: 0.12,     
    car: 0.09,          
    education: 0.05 , 
    gold:0.78 
  }
  return rate[loantype] || 0.1; 
}


const transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"singallakshay04@gmail.com",
    pass:"",
  },
});

const sendEmail = async (email, subject, message) => {
  try {
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject:subject,
      text: message,
    });
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Email error:", error);
  }
};



const Accountholder =mongoose.model("BANK",bankdata);

const loanholder=mongoose.model("LOan",loandata);


app.get('/',(req,res)=>{
  res.send("bank managemt api");
})

app.post('/addaccount',async(req,res)=>{
  try{
    const {accno,name,email,mobno,balance}=req.body;
    const newacc=new Accountholder({accno,name,email,mobno,balance});
    await newacc.save();
    res.status(201).send("Account added scuucesfully");

  }
  catch(error){
    console.log("error",error);
    res.status(400).send("error"+error.message);
  }
});

app.get('/getaccount/:accno',async(req,res)=>{
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
});

app.get('/getaccount',async(req,res)=>{
  try{
      
      const accholder=  await Accountholder.find();

      res.status(200).send(accholder);
  }
  catch(error){
    console.log("error"+error);
      res.status(400).send(error.message);
  }
});







app.get('/searchaccount', async (req, res) => {
  try {
    const { query } = req.query; 

    if (!query) {
      return res.status(400).send("Search query is required");
    }

    
    const accounts = await Accountholder.find({
      $or: [
        { accno: query }, 
        { name: { $regex: query, $options: "i" } }, 
        { email: { $regex: query, $options: "i" } }, 
        { mobno: query }
      ]
    });

    if (accounts.length === 0) {
      return res.status(404).send("No matching accounts found");
    }

    res.status(200).json(accounts);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});


app.put('/updateaccount/:accno', async (req, res) => {
  try {
    const accno = req.params.accno;
    const { name, email, mobno, balance } = req.body;

    if(!name || ! email || !mobno || !balance){
      res.send("nothing to update")
    }
   const updatedAccount = await Accountholder.findOneAndUpdate(
      { accno },
      { name, email, mobno, balance },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return res.status(404).send("Account not found");
    }

    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.put('/deposit/:acc',async(req,res)=>{
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
});


app.put('/withdraw/:acc',async(req,res)=>{
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
});



app.get('/transactions/:accno',async(req,res)=>{
  try{
  const accno=req.params.accno;
  const account=await Accountholder.findOne({accno});

  if (!account) return res.status(404).json({ error: "Account not found" });

  res.status(200).json(
    {
      message: "transactionhitsory", 
      currentbalance :account.balance,
      transaction: account.transactions}
    );

  }

  catch(error){
    res.status(400).json({ error: error.message });
  }
});




app.put('/transfer',async(req,res)=>{
  try{
    const {fromacc,toacc,amount}=req.body;

    if(!fromacc || !toacc || amount <= 0){
      return res.status(400).send('invalid transfer details');
    }
    const sender=await Accountholder.findOne({accno: fromacc});
    const recevier=await Accountholder.findOne({accno:toacc});

    if (!sender || !recevier) return res.status(404).send('Account not found');
    if (sender.status !== 'active' || recevier.status !== 'active') return res.status(400).send('One or both accounts are inactive');
    if (sender.balance < amount) return res.status(400).send('Insufficient balance');


    sender.balance-=amount;
    recevier.balance+=amount;

    sender.transactions.push({type:'Transfer out',amount,toacc:toacc,date:moment().format("YYYY-MM-DD HH:mm:ss") });  
    recevier.transactions.push({type:'Transfer in',amount,fromaccount:fromacc,date:new Date()});  

    await sender.save();

    await recevier.save();



    await sendEmail(
      sender.email,
      "Funds Transferred",
      `Dear ${sender.name},\n\nYou transferred ${amount} to account ${toacc}\n\nCurrent Balance: ${sender.balance}\n\nThanks for using our service \n\n Regards \n\n HM FINANCE`
    );

    await sendEmail(
      recevier.email,
      "Funds Received",
      `Dear ${recevier.name},\n\nYou received ${amount} from account ${fromacc}.\nNew Balance: ${recevier.balance}\n\nThanks for using our service \n\n Regards \n\n HM FINANCE`
    );

    res.status(200).send("Transfer successfull");




  }
  catch(error){
    res.status(500).send(error.message);
  }
})

























app.delete('/deleteaccount/:accno', async (req, res) => {
  try {
    const accno = req.params.accno;
    const deletedAccount = await Accountholder.findOneAndDelete({ accno });

    if (!deletedAccount) {
      return res.status(404).send("Account not found");
    }

    res.status(200).send("Account deleted successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});


app.get('/currentbalance/:accno',async(req,res)=>{
  try{
    const accno=req.params.accno;
  const account=await Accountholder.findOne({accno});
    
  if (!account) return res.status(404).json({ error: "Account not found" });

  res.status(200).json(
    {
      message:"current balance",
      balance: account.balance
    }
  )

  }
  catch(error){
    console.log(error);
    res.status(500).send(error.message);
  }
});




const statementsFolder = path.join(__dirname, 'statements');
if (!fs.existsSync(statementsFolder)) {
    fs.mkdirSync(statementsFolder,{ recursive: true });
}


app.get('/statement/pdf/:accno', async (req, res) => {
  try {
      const { accno } = req.params;
      const user = await Accountholder.findOne({ accno });

      if (!user) return res.status(404).send('Account not found');

      const pdfPath = path.join(statementsFolder, `${accno}_statement.pdf`);
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      doc.fontSize(20).text(`Account Statement`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Name: ${user.name}`);
      doc.text(`Account No: ${user.accno}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Mobile No: ${user.mobno}`);
      doc.text(`Balance: Rs.${user.balance}`);
      doc.moveDown();

      
      doc.fontSize(16).text('Transaction History:', { underline: true });
      doc.moveDown();
      user.transactions.forEach((txn, index) => {
          doc.fontSize(12).text(
              `${index + 1}. ${txn.type} | Amount: Rs.${txn.amount} | Date: ${txn.date}`
          );
      });

      doc.end(); 

      
      writeStream.on('finish', () => {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${accno}_statement.pdf"`);
          res.download(pdfPath);
      });

  } catch (error) {
      res.status(500).send("Error generating PDF: " + error.message);
  }
  
});





schedule.scheduleJob('40 23 * * *', async () => {
  try {
      const accounts = await Accountholder.find();
      for (const account of accounts) {
          if ( account.balance > 0) {
              const interest = (account.balance * 0.04) / 12; 
              account.balance += interest;
              account.transactions.push({ type: "Interest", amount: interest, date: moment().format("YYYY-MM-DD HH:mm:ss") });
              await account.save();

              await sendEmail(account.email, "Interest Credited", `Dear ${account.name}, Rs.${interest.toFixed(2)} has been added as interest to your account.`);
          }
      }
      console.log("Interest added to all accounts");
  } catch (error) {
      console.error("Interest Calculation Error:", error);
  }
});




app.post('/apply-loan',async(req,res)=>{
  try{
    const {accno,loantype,amount,tenure}=req.body;
    const account=await Accountholder.findOne({accno});

    if(!account)return res.status(404).send("Account not found");

    const interestRate=12;

    emi=40000;

    // const emi = (amount * interestRate) / (1 - Math.pow(1 + interestRate, -tenure));


    const newLoan = new loanholder({
      accno,
      loantype,
      amount,
      interestRate,
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
});








































app.listen(3000,()=>{
  console.log(`server running on http://localhost:${3000}`);
});

