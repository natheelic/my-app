import { NextResponse } from "next/server";
import { userExists, createUser } from "@/services/user.service";
import { hashPassword } from "@/utils/password";
import { validateRegistration } from "@/utils/validation";

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

    // Create user
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
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