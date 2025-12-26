import "./globals.css";
import type { Metadata } from 'next'
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: 'X Clone',
  description: 'Next.js social media application project',
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body>
        <ClerkProvider>
          <QueryProvider>
                {children}
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
