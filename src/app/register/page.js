import RegisterForm from "@/components/auth/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden bg-white animate-fadeIn">
        {/* Left side - Image */}
        <div className="relative hidden md:block bg-indigo-600">
          <Image 
            src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5"
            alt="Registration Banner" 
            layout="fill"
            objectFit="cover"
            priority
            className="opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/70 to-blue-800/70 flex flex-col items-center justify-center text-white p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-slideUp">Join Our Community</h1>
            <p className="text-lg md:text-xl opacity-90 text-center animate-slideUp" style={{ animationDelay: '150ms' }}>
              Create an account to access exclusive features and get started with our services.
            </p>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="py-8 px-6 sm:px-12 animate-slideUp" style={{ animationDelay: '300ms' }}>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}