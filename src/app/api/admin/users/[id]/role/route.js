import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession, isAdmin } from '@/utils/auth';

export async function PATCH(request, { params }) {
  try {
    // ตรวจสอบว่าผู้ใช้ที่ทำรายการเป็นผู้ดูแลระบบหรือไม่
    const session = getServerSession();
    
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = params.id;
    const { role } = await request.json();
    
    // ตรวจสอบความถูกต้องของบทบาท
    if (!['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // อัพเดตบทบาทของผู้ใช้
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error('Update role error:', error);
    return NextResponse.json(
      { message: 'Failed to update user role' },
      { status: 500 }
    );
  }
}