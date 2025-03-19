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

