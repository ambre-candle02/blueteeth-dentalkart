
import Link from "next/link";
import { Phone, Mail, HelpCircle } from "lucide-react";

export function TopBar() {
    return (
        <div className="bg-slate-200/80 text-slate-700 text-[12px] py-3.5 hidden md:block border-b border-slate-300 font-semibold tracking-wide">
            <div className="max-w-[1600px] w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2.5 hover:text-blue-600 transition-colors group">
                        <a href="https://wa.me/919999578292" target="_blank" rel="noopener noreferrer" className="flex items-center hover:scale-110 transition-transform">
                            <Phone size={14} className="text-blue-600" />
                        </a>
                        <a href="tel:+919999578292" className="hover:underline">+91 99995 78292</a>
                    </div>
                    <div className="w-px h-4 bg-slate-400" />
                    <div className="flex items-center space-x-2.5 hover:text-blue-600 transition-colors group">
                        <Mail size={14} className="text-blue-600 transition-colors" />
                        <a href="mailto:support@blueteeth.store" className="hover:underline">support@blueteeth.store</a>
                    </div>
                </div>
                <div className="flex items-center space-x-6 text-[11px] uppercase tracking-widest font-bold text-slate-600">
                    <Link href="/orders" className="hover:text-blue-600 cursor-pointer transition-colors">Track Order</Link>
                    <div className="w-px h-4 bg-slate-400" />
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">Partner With Us</span>
                    <div className="w-px h-4 bg-slate-400" />
                    <Link href="/contact" className="flex items-center space-x-2 hover:text-blue-600 cursor-pointer transition-colors group">
                        <HelpCircle size={14} className="text-blue-600 transition-colors" />
                        <span>Need Help?</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
