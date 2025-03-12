import { getServerSession } from '@/utils/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import UserTable from '@/components/admin/UserTable';

export default async function AdminUsersPage() {
  // ตรวจสอบว่าผู้ใช้เป็นผู้ดูแลระบบหรือไม่
  const session = getServerSession();
  
  if (!session || session.role !== 'ADMIN') {
    redirect('/unauthorized');
  }
  
  // ดึงข้อมูลผู้ใช้ทั้งหมด
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">จัดการผู้ใช้</h1>
        <Link
          href="/admin/dashboard"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          กลับสู่แดชบอร์ด
        </Link>
      </div>
      
      <UserTable users={users} />
    </div>
  );
}