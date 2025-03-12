const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('เริ่มต้นการสร้างข้อมูลเริ่มต้น...');

  try {
    // ลบข้อมูลผู้ใช้ทั้งหมดก่อน เพื่อหลีกเลี่ยงข้อมูลซ้ำ
    await prisma.user.deleteMany({});
    console.log('ลบข้อมูลผู้ใช้เดิมแล้ว');

    // สร้างรหัสผ่านแบบเข้ารหัส
    const hashPassword = async (password) => {
      return await bcrypt.hash(password, 10);
    };

    // สร้างผู้ดูแลระบบ
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: await hashPassword('admin123456'),
        role: 'ADMIN',
        status: 'ACTIVE',
        isVerified: true,
      }
    });
    
    // สร้างผู้ดูแลระบบระดับกลาง
    const moderatorUser = await prisma.user.create({
      data: {
        username: 'moderator',
        email: 'moderator@example.com',
        password: await hashPassword('moderator123'),
        role: 'MODERATOR',
        status: 'ACTIVE',
        isVerified: true,
      }
    });

    // สร้างผู้ใช้ทั่วไปที่ยืนยันตัวตนแล้ว
    const activeUser = await prisma.user.create({
      data: {
        username: 'user1',
        email: 'user1@example.com',
        password: await hashPassword('password123'),
        role: 'USER',
        status: 'ACTIVE',
        isVerified: true,
      }
    });

    // สร้างผู้ใช้ทั่วไปที่ยังไม่ได้ยืนยันตัวตน
    const pendingUser = await prisma.user.create({
      data: {
        username: 'user2',
        email: 'user2@example.com',
        password: await hashPassword('password123'),
        role: 'USER',
        status: 'PENDING',
        isVerified: false,
      }
    });

    // สร้างผู้ใช้ที่ถูกระงับบัญชี
    const suspendedUser = await prisma.user.create({
      data: {
        username: 'suspended',
        email: 'suspended@example.com',
        password: await hashPassword('password123'),
        role: 'USER',
        status: 'SUSPENDED',
        isVerified: true,
      }
    });

    console.log('สร้างข้อมูลผู้ใช้เริ่มต้นเรียบร้อยแล้ว');
    console.log('----------------------------------------');
    console.log('ผู้ดูแลระบบ:', adminUser.username);
    console.log('ผู้ช่วยผู้ดูแลระบบ:', moderatorUser.username);
    console.log('ผู้ใช้งานทั่วไป (ยืนยันแล้ว):', activeUser.username);
    console.log('ผู้ใช้งานทั่วไป (รอยืนยัน):', pendingUser.username);
    console.log('ผู้ใช้ที่ถูกระงับ:', suspendedUser.username);
    console.log('----------------------------------------');
    console.log('รหัสผ่านของผู้ดูแลระบบ: admin123456');
    console.log('รหัสผ่านของผู้ช่วยผู้ดูแลระบบ: moderator123');
    console.log('รหัสผ่านของผู้ใช้ทั่วไป: password123');
    console.log('----------------------------------------');

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างข้อมูลเริ่มต้น:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  console.log('สร้างข้อมูลเริ่มต้นเสร็จสมบูรณ์!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });