import { inferAsyncReturnType, initTRPC } from '@trpc/server';

export const createContext = async ({ req }: { req: Request }) => {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') || null;
  return { token };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export type Context = inferAsyncReturnType<typeof createContext>;
