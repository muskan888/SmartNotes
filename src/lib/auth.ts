import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';
const SALT_ROUNDS = 10;

/** .Hash Password */
export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

/** .Compare Password */
export const comparePassword = (inputPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(inputPassword, hashedPassword);
};

/** .Generate JWT Token */
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};

/** .Verify JWT Token */
export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string };
  } catch (error) {
    return null;
  }
};
