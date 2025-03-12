import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { generateVerificationToken, saveVerificationToken } from "@/services/user.service";
import { sendVerificationEmail } from "@/services/email.service";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username or email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with isVerified set to false
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isVerified: false, // ยังไม่ได้ยืนยันอีเมล
      },
    });

    // สร้าง verification token
    const verificationToken = generateVerificationToken();
    
    // บันทึก token ลงในฐานข้อมูล
    await saveVerificationToken(user.id, verificationToken);
    
    // ส่งอีเมลยืนยันตัวตน
    const emailResult = await sendVerificationEmail(user, verificationToken);

    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Registration successful! Please check your email to verify your account.",
        user: userWithoutPassword,
        emailSent: emailResult.success,
        previewUrl: process.env.NODE_ENV === 'development' ? emailResult.previewUrl : undefined
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}