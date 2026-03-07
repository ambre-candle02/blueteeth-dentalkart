"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
    className?: string;
    fallback?: string;
}

export function BackButton({ className, fallback = "/collection" }: BackButtonProps) {
    const router = useRouter();

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        // Check if there is history, though in Next.js back() is generally safe
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push(fallback);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={cn(
                "w-12 h-12 rounded-2xl bg-white border border-slate-100 text-brand-primary flex items-center justify-center shrink-0 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all group shadow-sm hover:shadow-lg hover:shadow-brand-primary/20",
                className
            )}
            title="Go Back"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
    );
}
