require("dotenv").config();
const serviceSendMail = require("./serviceSendMail");
const mails = require("./mails.json");

module.exports = async function serviceMailing(mail, details = {}) {
  /*
    
    service sending email
    
    input
    * mail : String capturing email to be sent (signup, reset, invited...)
    * details : Object including relevant details for email to be included

    possible response types
    * mail.mailing.success
    * mail.mailing.error.onsend
    * mail.mailing.error.nomailtosend
    
    */

  if (process.env.DEBUG) {
    console.log("mail.mailing");
  }

  const lang = "fr";
  const appurl = "https://apls-kappa.vercel.app"

  return new Promise((resolve, reject) => {
    // Prep email
    let mailToSend = null;
    let replacements = [];
    switch (mail) {
      case "signup":
        replacements = [
          {
            token: "{{USER_NAME}}",
            value:
              details.username,
          },
          {
            token: "{{ACTIVATION_URL}}",
            value:
              appurl + "/activation/" +
              details.activationtoken,
          },
        ];
        mailToSend = {
          to: "'" + details.username + "<" + details.login + ">'",
          subject: mails.signup[lang].subject,
          text: replaceTokens(mails.signup[lang].text, replacements),
          html: replaceTokens(mails.signup[lang].html, replacements),
        };
        break;
      case "resetpassword":
        replacements = [
          {
            token: "{{USER_NAME}}",
            value:
              details.username,
          },
          {
            token: "{{PASSWORD_RESET_URL}}",
            value:
              appurl + "/passwordreset?token=" +
              details.token,
          },
        ];
        mailToSend = {
          to: "'" + details.username + "<" + details.userlogin + ">'",
          subject: mails.resetpassword[lang].subject,
          text: replaceTokens(mails.resetpassword[lang].text, replacements),
          html: replaceTokens(mails.resetpassword[lang].html, replacements),
        };
        break;
      case "changelogin":
        replacements = [
          {
            token: "{{USER_NAME}}",
            value:
              details.username,
          },
          {
            token: "{{LOGIN_CHANGE_URL}}",
            value:
              appurl + "/loginchange?token=" +
              details.token,
          },
        ];
        mailToSend = {
          to: "'" + details.username + "<" + details.userlogin + ">'",
          subject: mails.resetpassword[lang].subject,
          text: replaceTokens(mails.resetpassword[lang].text, replacements),
          html: replaceTokens(mails.resetpassword[lang].html, replacements),
        };
        break;
      default:
        // mail not found
        break;
    }
    // Send email
    if (mailToSend) {
      serviceSendMail(mailToSend).then((outcome) => {
        if (outcome.type === "mail.sentmail.success") {
          console.log("mail.mailing.success");
          resolve({
            type: "mail.mailing.success",
          });
        } else {
          console.log("mail.mailing.error.onsend");
          resolve({
            type: "mail.mailing.error.onsend",
            error: outcome.error,
          });
        }
      });
    } else {
      console.log("mail.mailing.error.nomailtosend");
      resolve({
        type: "mail.mailing.error.nomailtosend",
      });
    }
  });
};

function replaceTokens(text, tokenList) {
  let replacedText = text;
  if (replacedText) {
    tokenList.forEach((replacement) => {
      replacedText = replacedText.replace(replacement.token, replacement.value);
    });
  }
  return replacedText;
}
