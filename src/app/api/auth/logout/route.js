import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // ลบ token cookie
    cookies().delete('token');
    
    return NextResponse.json({
      message: 'ออกจากระบบสำเร็จ'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    );
  }
}