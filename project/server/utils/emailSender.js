const nodemailer = require('nodemailer');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

function replaceContent(content, creds) {
    let allKeysArr = Object.keys(creds);
    allKeysArr.forEach(function (key) {
        content = content.replace(`#{${key}}`, creds[key]);
    });
    return content;
}

async function emailSender(templateName, receiverEmail, creds, subject) {
    console.log(templateName, receiverEmail, creds);
    try {
        const templatePath = path.join(__dirname, 'email_templates', templateName);
        let content = await fs.promises.readFile(templatePath, 'utf-8');
        const emailDetails = {
            to: receiverEmail,
            from: AUTH_EMAIL,
            subject: subject,
            text: `Hi ${creds.name}, this is your reset OTP: ${creds.otp}`,
            html: replaceContent(content, creds),
        };
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: AUTH_EMAIL,
                pass: AUTH_PASSWORD,
            },
        });
        await transporter.sendMail(emailDetails);
        console.log('Email sent');
    } catch (err) {
        console.log('Error sending email:', err);
    }
}

async function sendMail(userEmail, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: AUTH_EMAIL,
            pass: AUTH_PASSWORD,
        },
    });
    const mailOptions = {
        from: AUTH_EMAIL,
        to: userEmail,
        subject: subject,
        text: text,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.log('Error sending email:', error);
    }
}

module.exports = { emailSender, sendMail };
