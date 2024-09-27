require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = async function serviceSendMail(mailDetails) {
  /*
    
    service sending email
    
    input
    * mailDetails: a dict with all required email details
        - to: recipient email adress
        - subject: email subject
        - text: email flat text
        - html: email html code

    possible response types
    * mail.sentmail.success
    * mail.sentmail.failure
    
    */

  if (process.env.DEBUG) {
    console.log("mail.sentmail");
  }


  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return new Promise((resolve, reject) => {
    transporter
      .sendMail({
        from: "'Easy Communities team<" + process.env.MAIL_ADDRESS + ">'",
        to: mailDetails.to,
        subject: mailDetails.subject,
        text: mailDetails.text,
        html: mailDetails.html,
      })
      .then((info) => {
        console.log("mail.sentmail.success");
        resolve({
          type: "mail.sentmail.success",
          info: info,
        });
      })
      .catch((err) => {
        console.log("mail.sentmail.failure");
        console.log("err", err);
        resolve({
          type: "mail.sentmail.failure",
          error: err,
        });
      });
  });
};