import 'dotenv/config';
import nodemailer from 'nodemailer';
import { supabase } from '../../src/lib/supabase';

// dotenv.config() is not needed since we're using environment variables
// that are configured directly in Netlify's environment settings


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const handler = async (event, context) => {
  const { data: lendings, error } = await supabase.from('lendings').select('*');

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  const now = new Date();

  lendings.forEach(async (lending) => {
    const reminderDate = new Date(lending.date);
    const reminderFrequency = lending.reminderfrequency;

    if (reminderFrequency === 'daily') {
      reminderDate.setDate(reminderDate.getDate() + 1);
    } else if (reminderFrequency === 'weekly') {
      reminderDate.setDate(reminderDate.getDate() + 7);
    } else if (reminderFrequency === 'monthly') {
      reminderDate.setMonth(reminderDate.getMonth() + 1);
    } else if (reminderFrequency === 'yearly') {
      reminderDate.setFullYear(reminderDate.getFullYear() + 1);
    }

    if (now >= reminderDate) {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: lending.user_email,
        subject: 'Lending Reminder',
        text: `Reminder to ask ${lending.borrower} for payback of ₹${lending.amount}`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error(`Failed to send email to ${lending.user_email}: ${error.message}`);
      }
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Periodic reminders processed successfully' }),
  };
};