import { appRouter } from '@/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '@/server/trpc'; // ✅ Correct Import

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req }),  // ✅ Pass Correct Context
  });
};

export { handler as GET, handler as POST };
