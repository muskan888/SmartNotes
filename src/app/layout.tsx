import './globals.css';
import { ReactNode } from 'react';
import { TRPCProvider } from '@/app/_trpc/provider';

export const metadata = {
  title: 'Kibu Technical Project',
  description: 'Admin tool for member notes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider> {/* .Ensure TRPCProvider is wrapping everything */}
      </body>
    </html>
  );
}
