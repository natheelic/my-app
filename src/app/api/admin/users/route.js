import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession, isAdmin } from '@/utils/auth';

export async function GET(request) {
  try {
    // ตรวจสอบสิทธิ์ผู้ดูแลระบบ
    const session = getServerSession();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึงข้อมูล' }, { status: 403 });
    }
    
    // ดึงพารามิเตอร์การค้นหาและการเรียงลำดับ
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const orderBy = searchParams.get('orderBy') || 'createdAt';
    const orderDir = searchParams.get('orderDir') || 'desc';
    
    // สร้างเงื่อนไขการค้นหา
    const where = {
      OR: search ? [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ] : undefined,
      role: role || undefined,
      status: status || undefined
    };
    
    // ลบค่า undefined ออกจาก where
    Object.keys(where).forEach(key => {
      if (where[key] === undefined) {
        delete where[key];
      }
    });
    
    // นับจำนวนผู้ใช้ทั้งหมดที่ตรงเงื่อนไข
    const total = await prisma.user.count({ where });
    
    // ดึงข้อมูลผู้ใช้ตามเงื่อนไข
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { [orderBy]: orderDir },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    // คำนวณข้อมูลการแบ่งหน้า
    const pageCount = Math.ceil(total / limit);
    
    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pageCount,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}