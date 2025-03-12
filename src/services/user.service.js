import prisma from "@/lib/prisma";

/**
 * User related database operations
 */

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData
  });
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

export const findUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username }
  });
};

export const userExists = async (email, username) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });
  
  return !!user;
};