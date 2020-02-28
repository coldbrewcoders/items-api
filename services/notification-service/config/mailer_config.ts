import mailgun from "mailgun-js";
import MailComposer from "nodemailer/lib/mail-composer";
import Handlebars from "handlebars";
import path from "path";
import fs from "fs";

// Config
import logger from "./logger_config";

// Types
import { Mailgun } from "mailgun-js";
import { SendMailOptions } from "nodemailer";


// Find path to email template
const emailTemplatePath: string = path.join(__dirname, "../templates/email_template.hbs");

// Read email template file source
const source: Buffer = fs.readFileSync(emailTemplatePath);

// Create email template using handlebars
const template: HandlebarsTemplateDelegate<any> = Handlebars.compile(source.toString('ascii'));

// Initialize mailgun client with credentials
const mailgunClient: Mailgun = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });


const sendEmailNotification = async ({ email, subject, firstName, messageHeader, messageBody }: IEmailNotification): Promise<void> => {
  try {
    // Render handlebars html template
    const html = template({
      firstName,
      messageHeader,
      messageBody
    });

    // Set email options and content
    const mailOptions: SendMailOptions = {
      from: `notifications@${process.env.ROOT_EMAIL_DOMAIN}`,
      to: email,
      subject,
      html
    };

    // Create new instance of mail composer
    const mail: MailComposer = new MailComposer(mailOptions);

    // Compile email options and content to a buffer
    const message: Buffer = await mail.compile().build();

    // Create mailgun email payload
    const dataToSend = {
      to: email,
      message: message.toString('ascii')
    };

    // Send email
    // @ts-ignore sendMime method does exist despite TS error
    const response = await mailgunClient.messages().sendMime(dataToSend);

    // Log send mail response
    logger.info(`From mailgun -> ${response.message}`);
  }
  catch (error) {
    logger.error(error);
  }
}

export { sendEmailNotification };