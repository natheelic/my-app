"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UserTable({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const router = useRouter();
  
  // ฟังก์ชันสำหรับเปลี่ยนบทบาทของผู้ใช้
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user role');
      }
      
      // อัพเดตข้อมูลผู้ใช้ในตาราง
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast.success('อัพเดตบทบาทผู้ใช้เรียบร้อยแล้ว');
      
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  // ฟังก์ชันสำหรับเปลี่ยนสถานะของผู้ใช้
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user status');
      }
      
      // อัพเดตข้อมูลผู้ใช้ในตาราง
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      toast.success('อัพเดตสถานะผู้ใช้เรียบร้อยแล้ว');
      
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  // ฟังก์ชันสำหรับลบผู้ใช้
  const handleDeleteUser = async (userId) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }
      
      // ลบผู้ใช้ออกจากตาราง
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      toast.success('ลบผู้ใช้เรียบร้อยแล้ว');
      
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="px-6 py-3">ชื่อผู้ใช้</th>
            <th className="px-6 py-3">อีเมล</th>
            <th className="px-6 py-3">บทบาท</th>
            <th className="px-6 py-3">สถานะ</th>
            <th className="px-6 py-3">ยืนยันแล้ว</th>
            <th className="px-6 py-3">สร้างเมื่อ</th>
            <th className="px-6 py-3">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">{user.username}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                >
                  <option value="USER">ผู้ใช้ทั่วไป</option>
                  <option value="MODERATOR">ผู้ช่วยดูแล</option>
                  <option value="ADMIN">ผู้ดูแลระบบ</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                >
                  <option value="ACTIVE">ใช้งานได้</option>
                  <option value="SUSPENDED">ระงับการใช้งาน</option>
                  <option value="PENDING">รอการอนุมัติ</option>
                </select>
              </td>
              <td className="px-6 py-4">
                {user.isVerified ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-red-600">✗</span>
                )}
              </td>
              <td className="px-6 py-4">
                {new Date(user.createdAt).toLocaleDateString('th-TH')}
              </td>
              <td className="px-6 py-4 flex space-x-2">
                <button
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  ดูข้อมูล
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}