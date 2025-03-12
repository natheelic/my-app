import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession, isAdmin } from '@/utils/auth';

// ดึงข้อมูลผู้ใช้
export async function GET(request, { params }) {
  try {
    // ตรวจสอบสิทธิ์ผู้ดูแลระบบ
    const session = getServerSession();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึงข้อมูล' }, { status: 403 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      // ไม่ต้องดึงรหัสผ่าน
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        lastLogin: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// อัพเดทข้อมูลผู้ใช้
export async function PUT(request, { params }) {
  try {
    // ตรวจสอบสิทธิ์ผู้ดูแลระบบ
    const session = getServerSession();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์แก้ไขข้อมูล' }, { status: 403 });
    }
    
    const data = await request.json();
    
    // ตรวจสอบว่าข้อมูลที่ส่งมาถูกต้อง
    const { role, status } = data;
    
    // อัพเดทข้อมูลผู้ใช้
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        role,
        status,
        // อัพเดทข้อมูลอื่นๆ ตามต้องการ
      },
      // ไม่ต้องส่งรหัสผ่านกลับไป
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json({
      message: 'อัพเดทข้อมูลผู้ใช้สำเร็จ',
      user: updatedUser
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ลบผู้ใช้
export async function DELETE(request, { params }) {
  try {
    // ตรวจสอบสิทธิ์ผู้ดูแลระบบ
    const session = getServerSession();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ลบข้อมูล' }, { status: 403 });
    }
    
    // ตรวจสอบว่าไม่ใช่การลบตัวเอง
    if (session.id === params.id) {
      return NextResponse.json(
        { error: 'ไม่สามารถลบบัญชีผู้ดูแลระบบของตัวเองได้' }, 
        { status: 400 }
      );
    }
    
    await prisma.user.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: 'ลบผู้ใช้สำเร็จ' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}