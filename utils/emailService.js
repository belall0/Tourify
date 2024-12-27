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
    this.from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`;
  }

  createNewTransport() {
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.DEV_EMAIL_HOST,
        port: process.env.DEV_EMAIL_PORT,
        auth: {
          user: process.env.DEV_EMAIL_USERNAME,
          pass: process.env.DEV_EMAIL_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.PROD_EMAIL_HOST,
      port: process.env.PROD_EMAIL_PORT,
      auth: {
        user: process.env.PROD_EMAIL_USERNAME,
        pass: process.env.PROD_EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
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
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }
  sendPasswordReset() {}
}

// test
const user = {
  name: 'Fatma Ahmed',
  email: 'belallmuhammad0@gmail.com',
};

const url = 'http://localhost:3000/me';
new Email(user, url).sendWelcome();
