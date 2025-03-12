import nodemailer from 'nodemailer';

// สร้าง transporter สำหรับส่งอีเมล
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
      from: '"ระบบสมัครสมาชิก" <noreply@yourapp.com>',
      to: user.email,
      subject: 'กรุณายืนยันอีเมลของคุณ',
      text: `
        สวัสดี ${user.username},
        
        ขอบคุณสำหรับการลงทะเบียน กรุณายืนยันอีเมลของคุณโดยคลิกที่ลิงก์ด้านล่าง:
        
        ${verificationUrl}
        
        ลิงก์นี้จะหมดอายุภายใน 24 ชั่วโมง
        
        หากคุณไม่ได้สร้างบัญชีผู้ใช้นี้ กรุณาละเลยอีเมลนี้
      `,
      html: `
        <div style="font-family: 'K2D', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>ยืนยันอีเมลของคุณ</h2>
          <p>สวัสดี ${user.username},</p>
          <p>ขอบคุณสำหรับการลงทะเบียน กรุณายืนยันอีเมลของคุณโดยคลิกที่ปุ่มด้านล่าง:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              ยืนยันอีเมล
            </a>
          </div>
          <p>หรือคัดลอกและวางลิงก์นี้ในเบราว์เซอร์ของคุณ:</p>
          <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
          <p>ลิงก์นี้จะหมดอายุภายใน 24 ชั่วโมง</p>
          <p>หากคุณไม่ได้สร้างบัญชีผู้ใช้นี้ กรุณาละเลยอีเมลนี้
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