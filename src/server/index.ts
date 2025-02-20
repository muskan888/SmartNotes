import { router } from './trpc';
import { memberRouter } from './routers/member';
import { authRouter } from './routers/auth'; 

export const appRouter = router({
  member: memberRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
