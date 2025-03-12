const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  try {
    // Delete existing users to avoid duplicates
    await prisma.user.deleteMany({});
    console.log('Deleted existing users');

    // Create sample users
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', 10),
      }
    ];

    // Insert all users
    const createdUsers = await Promise.all(
      users.map(user => 
        prisma.user.create({
          data: user
        })
      )
    );

    console.log(`Created ${createdUsers.length} users`);
    console.log('Sample user data:');
    createdUsers.forEach(user => {
      // Log user data without password
      const { password, ...userWithoutPassword } = user;
      console.log(userWithoutPassword);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });