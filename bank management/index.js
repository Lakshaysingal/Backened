const express=require('express');
const cors=require('cors');
const mongoose=require("mongoose");


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
    balance:{type:Number,required:true}


    
});



const Accountholder =mongoose.model("BANK",bankdata);


app.get('/',(req,res)=>{
  res.send("hello world");
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
        {$inc: {balance:amount}},
      {new :true, runValidators:true}
      );

      if (!depositmoney) {
        return res.status(404).send("Account not found");
      }
      res.status(200).json({ message: "Deposit successful", newBalance: depositmoney.balance });
    
}
  catch(error){
    res.status(400).send("Error: " + error.message);
  }
});

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




app.listen(3000,()=>{
  console.log(`server running on http://localhost:${3000}`);
});






