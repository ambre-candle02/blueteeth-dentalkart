import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PolicyLayout({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FAFBFF] py-20">
            <div className="max-w-[1000px] mx-auto px-8">
                <Link href="/" className="inline-flex items-center gap-2 text-brand-primary font-bold mb-10 hover:translate-x-1 transition-transform">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
                <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">{title}</h1>
                    <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
