"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Send, Check } from "lucide-react";
import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { subscribeNewsletter } from "@/actions/newsletter-actions";

export function Footer() {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            try {
                const result = await subscribeNewsletter(email);
                if (result.success) {
                    setIsSubscribed(true);
                    setEmail("");
                    setTimeout(() => setIsSubscribed(false), 5000);
                } else {
                    alert(result.error || "Subscription failed. Please try again.");
                }
            } catch (err) {
                console.error(err);
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="flex flex-col">
            <footer className="bg-slate-50/80 text-slate-600 pt-20 pb-10 border-t border-slate-200">
                <div className="max-w-[1600px] w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                        {/* Brand Info */}
                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    B
                                </div>
                                <span className="text-2xl font-black text-brand-dark tracking-tight">Blueteeth</span>
                            </div>
                            <p className="text-[14px] leading-relaxed mb-8 text-slate-600 font-medium pe-4">
                                India&apos;s most trusted B2B dental marketplace. We provide premium dental equipment, instruments, and consumables to clinics across the nation.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="https://facebook.com/blueteeth" target="_blank" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-all shadow-md shadow-blue-600/20"><Facebook size={18} fill="currentColor" /></a>
                                <a href="https://twitter.com/blueteeth" target="_blank" className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white hover:scale-110 transition-all shadow-md shadow-sky-500/20"><Twitter size={18} fill="currentColor" /></a>
                                <a href="https://instagram.com/blueteeth" target="_blank" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white hover:scale-110 transition-all shadow-md shadow-pink-500/20"><Instagram size={18} /></a>
                                <a href="https://linkedin.com/company/blueteeth" target="_blank" className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center text-white hover:scale-110 transition-all shadow-md shadow-blue-800/20"><Linkedin size={18} fill="currentColor" /></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:col-span-2 lg:col-start-6">
                            <h3 className="text-brand-dark font-bold mb-6 text-[15px] uppercase tracking-wider">Quick Links</h3>
                            <ul className="space-y-4 text-[14px] font-medium">
                                <li><Link href="/about" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> About Us</Link></li>
                                <li><Link href="/contact" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> Contact Support</Link></li>
                                <li><Link href="/careers" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> Careers</Link></li>
                                <li><Link href="/blog" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> Dental Blog</Link></li>
                                <li><Link href="/new-clinic-setup" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> New Clinic Setup</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className="lg:col-span-2">
                            <h3 className="text-brand-dark font-bold mb-6 text-[15px] uppercase tracking-wider">Categories</h3>
                            <ul className="space-y-4 text-[14px] font-medium">
                                <li><Link href="/category/dental-chairs" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> Dental Chairs</Link></li>
                                <li><Link href="/category/x-ray-sensors" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> X-Ray Sensors</Link></li>
                                <li><Link href="/category/endo-motors" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> Endo Motors</Link></li>
                                <li><Link href="/category/composites" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> Composites</Link></li>
                                <li><Link href="/category/sterilization" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all hover:bg-brand-primary"></span> Sterilization</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="lg:col-span-3">
                            <h3 className="text-brand-dark font-bold mb-6 text-[15px] uppercase tracking-wider">Stay Updated</h3>
                            <p className="text-[13px] text-slate-600 mb-5 font-medium leading-relaxed">Subscribe to our newsletter for exclusive deals, early access, and new product launches.</p>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="bg-white border border-blue-200 text-slate-800 text-sm font-medium rounded-xl px-4 py-3 w-full hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm placeholder:text-slate-400"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={`py-3 px-4 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${isSubscribed ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-brand-primary hover:bg-brand-dark text-white"
                                        }`}
                                    disabled={isSubscribed}
                                >
                                    {isSubscribed ? (
                                        <>
                                            <Check size={18} /> Subscribed!
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} /> Subscribe Now
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-slate-600 font-medium">
                        <p>&copy; {new Date().getFullYear()} Blueteeth Dentalkart. All rights reserved.</p>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                            <Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link>
                            <Link href="/shipping" className="hover:text-brand-primary transition-colors">Shipping Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
            <TopBar />
        </div>
    );
}
