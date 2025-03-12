import { NextResponse } from 'next/server';
import { verifyToken } from './utils/auth';

export async function middleware(request) {
  // ดึง token จาก cookies
  const token = request.cookies.get('token')?.value;
  const user = token ? verifyToken(token) : null;
  
  // สำหรับหน้าที่ต้องเป็นผู้ดูแลระบบ
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  // สำหรับหน้าที่ต้องเป็นผู้ดูแลระบบหรือผู้ช่วย
  if (request.nextUrl.pathname.startsWith('/moderator')) {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  // สำหรับหน้าที่ต้องล็อกอินและมีสถานะ active
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/profile')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (user.status !== 'ACTIVE') {
      return NextResponse.redirect(new URL('/account-status', request.url));
    }
  }
  
  // สำหรับหน้าที่ไม่ต้องการล็อกอิน (เช่น login, register)
  if ((request.nextUrl.pathname.startsWith('/login') || 
       request.nextUrl.pathname.startsWith('/register')) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/moderator/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};