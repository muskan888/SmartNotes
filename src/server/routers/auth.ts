import { router, publicProcedure } from '@/server/trpc';
import { z } from 'zod';
import { getDb, saveDb } from '@/lib/db';
import { hashPassword, comparePassword, generateToken } from '@/lib/auth'; 


export const authRouter = router({
  /** .Register User */
  register: publicProcedure
    .input(z.object({
      username: z.string().min(3),
      password: z.string().min(6),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if user exists
      if (db.users.find(user => user.username === input.username)) {
        throw new Error('Username already exists');
      }

      // Hash password and save user
      const hashedPassword = await hashPassword(input.password);
      const newUser = { id: String(db.users.length + 1), username: input.username, password: hashedPassword };
      db.users.push(newUser);
      saveDb(db);

      return { success: true, message: 'User registered successfully' };
    }),

  /** .Login User */
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const user = db.users.find(user => user.username === input.username);

      if (!user || !(await comparePassword(input.password, user.password))) {
        throw new Error('Invalid username or password');
      }

      const token = generateToken(user.id);
      return { success: true, token };
    }),
});

export type AuthRouter = typeof authRouter;
