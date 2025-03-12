import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// สร้าง JWT token
export const createToken = (user) => {
  // ไม่ใส่ข้อมูลที่อ่อนไหวใน payload
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    status: user.status,
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // token หมดอายุใน 1 วัน
  );
};

// ตรวจสอบและถอดรหัส token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// ดึงข้อมูลผู้ใช้ปัจจุบันจาก token (สำหรับ Server Component)
export const getServerSession = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
};

// ตรวจสอบว่าผู้ใช้มีสิทธิ์เป็นผู้ดูแลระบบหรือไม่
export const isAdmin = (user) => {
  return user && user.role === 'ADMIN';
};

// ตรวจสอบว่าผู้ใช้มีสิทธิ์เป็นผู้ดูแลระบบหรือผู้ช่วยผู้ดูแลระบบหรือไม่
export const isAdminOrModerator = (user) => {
  return user && (user.role === 'ADMIN' || user.role === 'MODERATOR');
};

// ตรวจสอบว่าผู้ใช้มีสถานะ active หรือไม่
export const isActive = (user) => {
  return user && user.status === 'ACTIVE';
};