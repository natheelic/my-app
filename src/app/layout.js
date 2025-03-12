import { Geist, Geist_Mono, K2D } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// กำหนดค่าฟอนต์ K2D สำหรับใช้งานทั้งเว็บไซต์
const k2d = K2D({
  weight: ['300', '400', '500', '600', '700'], // น้ำหนักฟอนต์ที่ต้องการใช้
  subsets: ['latin', 'thai'], // กำหนด subsets เพื่อรองรับทั้งภาษาอังกฤษและไทย
  variable: '--font-k2d',
  display: 'swap',
});

export const metadata = {
  title: "ระบบสมัครสมาชิก",
  description: "ระบบสมัครสมาชิกที่ทันสมัยพร้อมการยืนยันอีเมล",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={k2d.variable}>
      <body className="font-k2d antialiased">
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              fontFamily: 'var(--font-k2d)', // ใช้ฟอนต์ K2D กับ toast ด้วย
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
              style: {
                border: '1px solid rgba(34, 197, 94, 0.2)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                border: '1px solid rgba(239, 68, 68, 0.2)',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
