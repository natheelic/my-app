"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [verificationState, setVerificationState] = useState({
    isLoading: true,
    isSuccess: false,
    error: null
  });
  
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationState({
          isLoading: false,
          isSuccess: false,
          error: "ไม่พบรหัสยืนยัน"
        });
        return;
      }
      
      try {
        const response = await fetch(`/api/verify-email?token=${token}`, {
          method: "GET"
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "ไม่สามารถยืนยันอีเมลได้");
        }
        
        setVerificationState({
          isLoading: false,
          isSuccess: true,
          error: null
        });
      } catch (error) {
        setVerificationState({
          isLoading: false,
          isSuccess: false,
          error: error.message
        });
      }
    };
    
    verifyToken();
  }, [token]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg animate-fadeIn">
        {verificationState.isLoading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">กำลังตรวจสอบยืนยันอีเมลของคุณ...</h2>
          </div>
        ) : verificationState.isSuccess ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ยืนยันอีเมลสำเร็จ!</h2>
            <p className="text-gray-600 mb-6">
              อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบได้ทันที
            </p>
            <Link 
              href="/login" 
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              ไปยังหน้าเข้าสู่ระบบ
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">การยืนยันล้มเหลว</h2>
            <p className="text-red-500 mb-6">
              {verificationState.error || "ลิงก์ยืนยันอาจหมดอายุหรือไม่ถูกต้อง"}
            </p>
            <div className="space-y-4">
              <Link 
                href="/register" 
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full"
              >
                ลงทะเบียนอีกครั้ง
              </Link>
              <Link 
                href="/login" 
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors w-full"
              >
                กลับไปยังหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}