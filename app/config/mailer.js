const nodemailer = require('nodemailer');

let configOptions = {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
}


const transporter = nodemailer.createTransport(configOptions)


const mail = async (to, subject, text, token) => {
   await transporter.sendMail({
      from: process.env.MAIL_EMAIL,
      to: to, 
      subject: subject, 
      text: text,
      html : `<a href=${process.env.APP_URL}/auth/verify/${token}}>Verify Account</a>`
    });
  
  }

  module.exports = {
    mail
  }