"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { AtSymbolIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { loginUser } from "@/services/auth.service";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({
    email: null,
    password: null
  });
  const [error, setError] = useState(null);

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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Don't proceed if validation fails
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the imported loginUser service instead of direct fetch
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'เข้าสู่ระบบล้มเหลว');
      }
      
      toast.success('เข้าสู่ระบบสำเร็จ');
      
      // Add a small delay before redirect to ensure the toast is visible
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
      
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="font-k2d text-3xl font-bold mb-2 text-gray-900 thai-text">เข้าสู่ระบบ</h2>
        <p className="font-k2d text-gray-600 thai-text">ยินดีต้อนรับกลับ! กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="กรอกรหัสผ่านของคุณ"
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 font-k2d thai-text">
              จดจำฉัน
            </label>
          </div>
          
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors font-k2d thai-text"
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>
        
        <div className="mt-6">
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            เข้าสู่ระบบ
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600 font-k2d thai-text">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}