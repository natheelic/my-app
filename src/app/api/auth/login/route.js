import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByEmail } from '@/services/user.service';
import { verifyPassword } from '@/utils/password';
import { createToken } from '@/utils/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // ค้นหาผู้ใช้จากอีเมล
    const user = await findUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ตรวจสอบรหัสผ่าน
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้ใช้ยืนยันอีเมลแล้วหรือไม่
    if (!user.isVerified) {
      return NextResponse.json(
        { message: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ' },
        { status: 403 }
      );
    }

    // ตรวจสอบสถานะของผู้ใช้
    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { message: 'บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ' },
        { status: 403 }
      );
    }

    // สร้าง token
    const token = createToken(user);

    // บันทึก token ใน HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 วัน
      path: '/'
    };

    cookies().set('token', token, cookieOptions);

    // ปรับสถานะเป็น ACTIVE หากเป็น PENDING
    if (user.status === 'PENDING') {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: 'ACTIVE' }
      });
    }

    // ส่งข้อมูลผู้ใช้กลับโดยไม่มีข้อมูลที่อ่อนไหว
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}