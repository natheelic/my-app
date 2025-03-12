import prisma from "@/lib/prisma";
import crypto from "crypto";

/**
 * User related database operations
 */

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData
  });
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

export const findUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username }
  });
};

export const userExists = async (email, username) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });
  
  return !!user;
};

export const generateVerificationToken = () => {
  // สร้าง token แบบสุ่ม
  return crypto.randomBytes(32).toString('hex');
};

export const saveVerificationToken = async (userId, token) => {
  // สร้างวันหมดอายุ (24 ชั่วโมง)
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  
  // บันทึก token และวันหมดอายุลงในฐานข้อมูล
  return await prisma.user.update({
    where: { id: userId },
    data: {
      verificationToken: token,
      verificationTokenExpiry: expires,
    }
  });
};

export const verifyEmail = async (token) => {
  // หาผู้ใช้ที่มี token ตรงกันและยังไม่หมดอายุ
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpiry: {
        gt: new Date() // token ยังไม่หมดอายุ
      }
    }
  });
  
  if (!user) {
    return { success: false, message: 'Invalid or expired token' };
  }
  
  // อัพเดทข้อมูลผู้ใช้เมื่อยืนยันอีเมลสำเร็จ
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    }
  });
  
  return { success: true, message: 'Email verified successfully' };
};