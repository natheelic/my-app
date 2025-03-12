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
    const { status } = await request.json();
    
    // ตรวจสอบความถูกต้องของสถานะ
    if (!['ACTIVE', 'SUSPENDED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // อัพเดตสถานะของผู้ใช้
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
      },
    });
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json(
      { message: 'Failed to update user status' },
      { status: 500 }
    );
  }
}