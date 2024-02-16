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


const mail = async (to, subject, text, link, linkTitle) => {
   await transporter.sendMail({
      from: process.env.APP_EMAIL,
      to: to, 
      subject: subject, 
      text: text,
      html : `<a href=${link}>${linkTitle}</a>`
    });
  
  }

  module.exports = {
    mail
  }