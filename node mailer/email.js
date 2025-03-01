const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "singallakshay09@gmail.com", 
    pass: "xfng xrsv gmui ynas",   
  },
});

const mailOptions = {
  from: "your-email@gmail.com",
  to: "singallakshay84@gmail.com",  
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





