// src/app/layout.tsx
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc";

export const metadata = {
  title: "My Blog",
  description: "A full-stack blog using Next.js + tRPC + Drizzle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
