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
    
    // Clear specific field error when user types
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
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
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
      
      toast.success("Registration successful! Please check your email to verify your account.", {
        duration: 6000,
      });
      
      // แสดงหน้ายืนยันอีเมลแทนฟอร์ม
      setFormSubmitted(true);
      setEmailAddress(formData.email);
      
      // Reset form after successful registration
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      
      // ถ้าอยู่ในโหมดพัฒนา แสดงลิงก์ทดสอบการยืนยันอีเมล
      if (result.previewUrl) {
        console.log('Email preview:', result.previewUrl);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ถ้าส่งฟอร์มสำเร็จ แสดงข้อความให้ตรวจสอบอีเมล
  if (formSubmitted) {
    return (
      <div className="w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a verification link to <span className="font-medium">{emailAddress}</span>.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-left mb-6">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">
              Please click the verification link in the email to complete your registration.
              The link will expire in 24 hours.
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setFormSubmitted(false)}
          variant="outline"
          fullWidth
        >
          Go Back to Registration
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h2>
        <p className="text-gray-600">Join us today and start exploring</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="username"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          required
          placeholder="Enter your username"
          error={errors.username}
          icon={<UserIcon className="h-5 w-5" />}
        />
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
          placeholder="Enter your email"
          error={errors.email}
          icon={<AtSymbolIcon className="h-5 w-5" />}
        />
        
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            placeholder="Create a password"
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
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
            placeholder="Confirm your password"
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
            Create Account
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              Sign in
            </Link>
          </p>
          
          <p className="mt-3 text-xs text-gray-500">
            By registering, you agree to our{' '}
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-800">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800">
              Privacy Policy
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}