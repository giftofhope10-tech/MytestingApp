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
      from: 'Close Testing Group <idverify@closetesting.online>',
      to: email,
      subject: 'Your Verification Code - Close Testing Group',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://closetesting.online/logo.webp" alt="Close Testing Group" style="max-width: 200px; height: auto;" />
          </div>
          <p style="color: #374151; font-size: 16px;">Your verification code is:</p>
          <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 25px; text-align: center; border-radius: 12px; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #FFFFFF;">${otp}</span>
          </div>
          <p style="color: #6B7280; margin-top: 20px; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #6B7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Close Testing Group - Professional Google Play Closed Testing Platform<br/>
            Need help? Contact us at <a href="mailto:support@closetesting.online" style="color: #4F46E5;">support@closetesting.online</a>
          </p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
}
