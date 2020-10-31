const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" });

async function sendEmail(to, subject, html) {
  const user = process.env["USER"];
  const pass = process.env["PASS"];

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: user, pass: pass },
  });

  const mailOptions = {
    from: user,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent! " + info.response);
  } catch (error) {
    console.log("Error sending email! " + error);
  }
}

function parseOfferToEmail(offers) {
  const { productName, store, url, price, priceString } = offers[0]; // cheapest
  const subject = `${productName} - ${priceString}`;
  const html = `<strong>${productName}</strong> only <strong>${priceString}</strong> at <strong>${store}</strong><br>${url}`;

  const mail = { subject, html };

  return mail;
}

module.exports = { sendEmail, parseOfferToEmail };
