import { getServerSession } from "@/utils/auth";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const session = getServerSession();
  
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold font-k2d thai-text mb-4">ยินดีต้อนรับ, {session.username}!</h1>
          <p className="text-gray-600 font-k2d thai-text">
            คุณได้เข้าสู่ระบบแล้ว นี่คือหน้าแดชบอร์ดสำหรับผู้ใช้
          </p>
        </div>
      </div>
    </div>
  );
}