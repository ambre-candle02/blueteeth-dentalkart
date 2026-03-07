import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blueteeth Dentalkart",
  description: "Premium Dental E-commerce Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "antialiased bg-slate-50")}>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <SonnerToaster position="bottom-right" richColors />
          <HotToaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
