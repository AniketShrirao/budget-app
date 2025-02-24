require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.VITE_GMAIL_USER,
    pass: process.env.VITE_GMAIL_PASS,
  },
});

exports.handler = async (event, context) => {
  console.log('Received event:', event);
  console.log('Received context:', context);

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
    console.log('Parsed body:', parsedBody);
  } catch (error) {
    console.error('Failed to parse body:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  const { email, borrower, amount, type } = parsedBody;

  const mailOptions = {
    from: process.env.VITE_GMAIL_USER,
    to: email,
    subject: type === 'acknowledgment' ? 'Lending Reminder Added' : 'Lending Reminder',
    text: type === 'acknowledgment'
      ? `You have successfully added a lending reminder for ${borrower} with an amount of ₹${amount}.`
      : `Reminder to ask ${borrower} for payback of ₹${amount}`,
  };

  console.log('Mail options:', mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

