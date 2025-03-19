const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
        service: "gmail",
        auth:{
            user:"",
            pass:"",
        },
});


const sendEmail = async (email, subject, message) => {
    try {
        await transporter.sendMail({
            from: "your-email@gmail.com",
            to: email,
            subject: subject,
            text: message,
        });
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error("Email error:", error);
    }
};

module.exports = sendEmail;