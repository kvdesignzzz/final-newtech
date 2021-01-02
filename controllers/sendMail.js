const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const MAILING_SERVICE_CLIENT_ID =
  "538922737352-ipukd1aaa4hroq167nfj3tn69q810aha.apps.googleusercontent.com";

const MAILING_SERVICE_CLIENT_SECRET = "XFePzifbeHjQ0OVJfBL8X0jb";

const MAILING_SERVICE_REFRESH_TOKEN =
  "1//04de6L6TIPknHCgYIARAAGAQSNwF-L9IrBSzukpl2NsX1gv-SMou-TDWLQAGD6ooAknWd1F9sAJaoqR0B6pQptkM5b8UlgPBKHqo";

const SENDER_EMAIL_ADDRESS = "bboykaku000@gmail.com";
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

// send mail
const sendEmail = (to, url, txt) => {
  oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
  });

  const accessToken = oauth2Client.getAccessToken();
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: SENDER_EMAIL_ADDRESS,
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: SENDER_EMAIL_ADDRESS,
    to: to,
    subject: "Create Account",
    html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the L&H SHOP.</h2>
            <p>Congratulations! You're almost set to start using L&H✮SHOP.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        `,
  };

  smtpTransport.sendMail(mailOptions, (err, infor) => {
    if (err) {
      console.log("Mail couldn't be sent because: " + err);
    } else {
      console.log("Mail sent");
      return infor;
    }
  });
};

module.exports = sendEmail;
