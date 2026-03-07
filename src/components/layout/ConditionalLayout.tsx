"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import dynamic from "next/dynamic";

// Lazy load heavy components — only on user-facing pages
const Chatbot = dynamic(() => import("@/components/features/Chatbot").then(m => m.Chatbot), {
    ssr: false,
    loading: () => null,
});

const BackToTop = dynamic(() => import("@/components/ui/BackToTop").then(m => m.BackToTop), {
    ssr: false,
    loading: () => null,
});

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password") ||
        pathname.startsWith("/admin");

    if (isAuthPage) {
        return (
            <main className="min-h-screen bg-white">
                {children}
            </main>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Chatbot />
            <BackToTop />
        </>
    );
}

