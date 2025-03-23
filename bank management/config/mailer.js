const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
        service: "gmail",
        auth:{
            user:"singallakshay04@gmail.com",
            pass:"nwrq gzzn ppns sjvu",
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