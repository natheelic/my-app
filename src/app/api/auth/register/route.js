import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { userExists, createUser, generateVerificationToken, saveVerificationToken } from "@/services/user.service";
import { hashPassword } from "@/utils/password";
import { validateRegistration } from "@/utils/validation";
import { sendVerificationEmail } from "@/services/email.service";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validate registration data
    const validation = validateRegistration(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { message: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const exists = await userExists(email, username);
    if (exists) {
      return NextResponse.json(
        { message: "Username or email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with default role and status
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
      role: 'USER',
      status: 'PENDING',
      isVerified: false,
    });

    // Generate verification token
    const verificationToken = generateVerificationToken();
    
    // Save token in database
    await saveVerificationToken(user.id, verificationToken);
    
    // Send verification email
    const emailResult = await sendVerificationEmail(user, verificationToken);

    // Return user without sensitive information
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