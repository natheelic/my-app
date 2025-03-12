import nodemailer from 'nodemailer';

// สร้าง transporter สำหรับส่งอีเมล
// สำหรับการพัฒนา เราจะใช้ ethereal.email ซึ่งเป็นบริการทดสอบ
// สำหรับการใช้งานจริง คุณต้องใช้บริการอีเมลจริง เช่น Gmail, SendGrid, Amazon SES
export async function createTransporter() {
  // ใช้ ethereal.email สำหรับการทดสอบ
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return { transporter, testAccount };
}

// ส่งอีเมลยืนยันตัวตน
export async function sendVerificationEmail(user, verificationToken) {
  try {
    const { transporter, testAccount } = await createTransporter();
    
    // URL สำหรับยืนยันอีเมล
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    
    const info = await transporter.sendMail({
      from: '"Your App" <noreply@yourapp.com>',
      to: user.email,
      subject: 'Please verify your email address',
      text: `
        Hello ${user.username},
        
        Thank you for registering. Please verify your email by clicking on the link below:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you did not create an account, you can safely ignore this email.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Hello ${user.username},</p>
          <p>Thank you for registering. Please verify your email by clicking on the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account, you can safely ignore this email.</p>
        </div>
      `,
    });
    
    console.log('Message sent: %s', info.messageId);
    
    // Preview URL สำหรับทดสอบ (ethereal.email)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return {
      success: true,
      previewUrl: nodemailer.getTestMessageUrl(info),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}