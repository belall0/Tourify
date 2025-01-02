import nodemailer from 'nodemailer';
import pug from 'pug';
import dotenv from 'dotenv';
import { convert } from 'html-to-text';
dotenv.config();

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`;
  }

  createNewTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    try {
      // 1. render HTML based on a pug template
      const html = pug.renderFile(`${import.meta.dirname}/../views/emails/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });

      // 2. define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html),
      };

      // 3. create a transport and send email
      await this.createNewTransport().sendMail(mailOptions);
    } catch (err) {
      throw new Error(err);
    }
  }

  async sendWelcome() {
    try {
      await this.send('welcome', 'Welcome to the Tourify 🎉!');
    } catch (error) {
      console.error(`Error Details: ${error.message}`);
    }
  }

  async sendPasswordReset() {
    try {
      await this.send('passwordReset', 'Password Reset Request - Tourify');
    } catch (error) {
      console.error(`Error Details: ${error.message}`);
    }
  }

  async sendEmailVerification() {
    try {
      await this.send('verifyEmail', 'Verify Email Address - Tourify');
    } catch (error) {
      console.error(`Error Details: ${error.message}`);
    }
  }
}

export default Email;
