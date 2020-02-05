const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");
const handlebars = require("node-handlebars").create({ extension: ".hbs" });
const path = require("path");
const util = require("util");


// Find path to email template
const emailTemplatePath = path.join(__dirname, "../templates/email_template.hbs");

// Create transporter mail client through Mailgun
const transporter = nodemailer.createTransport(mailgun({
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
}));

// Create a promisified version of handlebars engine
const createEmailHtml = util.promisify(handlebars.engine);

// Create a promisified version of nodemailer's sendMail
const sendMail = util.promisify(transporter.sendMail);


const sendEmailNotification = async (userEmail, emailSubject, firstName, messageHeader, messageBody) => {
  try {
    // Specify values to populate email template
    const templateValues = {
      firstName,
      messageHeader,
      messageBody
    };

    // Get raw html email using handlebars
    const html = await createEmailHtml(emailTemplatePath, templateValues);

    // Specify email details and content
    const mailOptions = {
      from: process.env.MAILGUN_DOMAIN,
      to: userEmail,
      subject: emailSubject,
      html
    };

    // Send email
    await sendMail(mailOptions);
  }
  catch (error) {
    console.error(error);
  }
}


module.exports = {
  sendEmailNotification
};