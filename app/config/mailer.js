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

const main = async (to, subject, text) => {
    const info = await transporter.sendMail({
      from: process.env.MAIL_EMAIL,
      to: to, 
      subject: subject, 
      text: text,
    });
  
  }

  module.exports = {
    main
  }