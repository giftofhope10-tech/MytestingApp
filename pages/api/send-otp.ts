import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { generateOTP, storeOTP } from '../../lib/otp';
import { isTempMail } from '../../lib/tempmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (isTempMail(email)) {
    return res.status(400).json({ error: 'Temporary email addresses are not allowed. Please use a permanent email.' });
  }

  const otp = generateOTP();
  
  try {
    await storeOTP(email, otp);
  } catch (storeError) {
    console.error('Failed to store OTP:', storeError);
    return res.status(500).json({ error: 'Database error. Please ensure Firestore is enabled in your Firebase project.' });
  }

  try {
    await resend.emails.send({
      from: 'Close Testing Group <onboarding@resend.dev>',
      to: email,
      subject: 'Your Verification Code - Close Testing Group',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Close Testing Group</h2>
          <p>Your verification code is:</p>
          <div style="background: #F3F4F6; padding: 20px; text-align: center; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1F2937;">${otp}</span>
          </div>
          <p style="color: #6B7280; margin-top: 20px;">This code will expire in 10 minutes.</p>
          <p style="color: #6B7280;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
}
