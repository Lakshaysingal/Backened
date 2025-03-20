const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "singallakshay04@gmail.com", 
    pass: "",   
  },
});

const mailOptions = {
  from: "your-email@gmail.com",
  to: "ex@gmail.com",  
  subject: "Email test",
  text: "Hello! This is a test email sent using Nodemailer in Node.js. by Lakshay",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Email sent successfully:", info.response);
  }
});





