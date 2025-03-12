"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { registerUser } from "@/services/auth.service";
import { AtSymbolIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Link from "next/link";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({
    username: null,
    email: null,
    password: null,
    confirmPassword: null
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      })); 
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "กรุณากรอกชื่อผู้ใช้";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      toast.success("ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี", {
        duration: 6000,
      });
      
      setFormSubmitted(true);
      setEmailAddress(formData.email);
      
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      
      if (result.previewUrl) {
        console.log('ตัวอย่างอีเมล:', result.previewUrl);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (formSubmitted) {
    return (
      <div className="w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">กรุณาตรวจสอบอีเมล</h2>
          <p className="text-gray-600">
            เราได้ส่งลิงก์ยืนยันไปยัง <span className="font-medium">{emailAddress}</span>
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-left mb-6">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">
              กรุณาคลิกลิงก์ยืนยันในอีเมลเพื่อดำเนินการลงทะเบียนให้เสร็จสมบูรณ์
              ลิงก์จะหมดอายุภายใน 24 ชั่วโมง
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setFormSubmitted(false)}
          variant="outline"
          fullWidth
        >
          กลับไปยังหน้าลงทะเบียน
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">สร้างบัญชีผู้ใช้</h2>
        <p className="text-gray-600">สมัครสมาชิกวันนี้และเริ่มใช้งานได้ทันที</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="username"
          name="username"
          label="ชื่อผู้ใช้"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          required
          placeholder="กรอกชื่อผู้ใช้"
          error={errors.username}
          icon={<UserIcon className="h-5 w-5" />}
        />
        
        <Input
          id="email"
          name="email"
          type="email"
          label="อีเมล"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
          placeholder="กรอกอีเมลของคุณ"
          error={errors.email}
          icon={<AtSymbolIcon className="h-5 w-5" />}
        />
        
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="รหัสผ่าน"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            placeholder="สร้างรหัสผ่าน"
            error={errors.password}
            icon={<LockClosedIcon className="h-5 w-5" />}
          />
          <button 
            type="button" 
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 
              <EyeSlashIcon className="h-5 w-5" /> : 
              <EyeIcon className="h-5 w-5" />
            }
          </button>
        </div>
        
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            label="ยืนยันรหัสผ่าน"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
            placeholder="ยืนยันรหัสผ่านของคุณ"
            error={errors.confirmPassword}
            icon={<LockClosedIcon className="h-5 w-5" />}
          />
          <button 
            type="button" 
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 
              <EyeSlashIcon className="h-5 w-5" /> : 
              <EyeIcon className="h-5 w-5" />
            }
          </button>
        </div>
        
        <div className="mt-2">
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            สร้างบัญชี
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            มีบัญชีผู้ใช้อยู่แล้ว?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              เข้าสู่ระบบ
            </Link>
          </p>
          
          <p className="mt-3 text-xs text-gray-500">
            การลงทะเบียนถือว่าคุณยอมรับ{' '}
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-800">
              เงื่อนไขการใช้งาน
            </Link>{' '}
            และ{' '}
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800">
              นโยบายความเป็นส่วนตัว
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}