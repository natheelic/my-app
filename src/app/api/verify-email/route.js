import { NextResponse } from "next/server";
import { verifyEmail } from "@/services/user.service";

export async function GET(request) {
  try {
    // รับ token จาก query parameter
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is missing' },
        { status: 400 }
      );
    }
    
    // ตรวจสอบและยืนยัน token
    const result = await verifyEmail(token);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
    
    // สำเร็จ
    return NextResponse.json(
      { success: true, message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}