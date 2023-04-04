const nodemailer = require("nodemailer");
const sendemail = async (options) => {
  var transport = nodemailer.createTransport({
    /*host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b958a87843de2a",
      pass: "ea42af63c456f0",
    },*/
    service: "gmail",
    secure: false,
    port: 25,
    auth: {
      user: "tuyennguyen11123@gmail.com",
      pass: "kemdztgkjmgsppmj",
    },
  });
  let mailOptions = {
    from: "tuyennguyen11123@gmail.com",
    to: options.gmail,
    subject: "Your password reset token (valid for 10 min)",
    text: options.message,
  };
  await transport.sendMail(mailOptions);
};
module.exports = sendemail;
