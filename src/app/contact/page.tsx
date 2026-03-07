'use client';

import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Loader2, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/ui/BackButton";
import { submitSupportRequest } from "@/actions/support-actions";

function ContactContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        if (orderId) {
            setFormData(prev => ({
                ...prev,
                message: `Hello, I need support regarding my Order ID: ${orderId}.\n\nMy Issue: `
            }));
        }
    }, [orderId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await submitSupportRequest({
                firstName: formData.firstName,
                email: formData.email,
                message: formData.message
            });

            if (result.success) {
                setIsSubmitted(true);
                setFormData({ firstName: '', lastName: '', email: '', message: '' });
            } else {
                alert("Transmission failed. Please check your clinical uplink.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="bg-[#FAFBFF] min-h-screen pt-6 pb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full -mr-48 -mt-48 blur-[100px]" />

            <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
                <div className="mb-6">
                    <BackButton />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-brand-primary/10">
                        <Sparkles size={12} />
                        Clinical Support
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">How can we assist you?</h1>
                    <p className="text-base text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
                        Access direct clinical support lines or transmit an encrypted message.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
                    {/* Compact Contact Info */}
                    <div className="lg:col-span-4 space-y-4">
                        {[
                            {
                                title: "Direct Line",
                                value: "+91 99995 78292",
                                href: "tel:+919999578292",
                                icon: Phone,
                                color: "text-blue-600 bg-blue-50",
                                sub: "Mon-Fri, 9AM-8PM"
                            },
                            {
                                title: "Transmission",
                                value: "support@blueteeth.store",
                                href: "mailto:support@blueteeth.store",
                                icon: Mail,
                                color: "text-indigo-600 bg-indigo-50",
                                sub: "Encrypted Response"
                            },
                            {
                                title: "Corporate HQ",
                                value: "Chirag Delhi Metro Stn, Masjid Moth, ND-110017",
                                href: "https://maps.google.com/?q=Chirag+Delhi+Metro+Station+New+Delhi",
                                icon: MapPin,
                                color: "text-emerald-600 bg-emerald-50",
                                sub: "New Delhi Protocol"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="p-1 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="p-5 bg-white rounded-[1.25rem] border border-slate-50 flex items-center gap-5">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner", item.color)}>
                                        <item.icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.title}</p>
                                            <p className="text-[8px] font-black text-slate-300 uppercase">{item.sub}</p>
                                        </div>
                                        <a href={item.href} className="text-slate-600 font-bold text-sm hover:text-brand-primary transition-colors block leading-tight mt-1">{item.value}</a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Smaller WhatsApp CTA */}
                        <div className="p-1 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/10 mt-6 overflow-hidden">
                            <div className="p-5 bg-white/40 backdrop-blur-sm rounded-[1.25rem] border border-white/50 flex items-center gap-5">
                                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
                                    <MessageCircle size={20} />
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-black text-slate-900 text-sm">Live Protocol</h4>
                                        <p className="text-[9px] font-bold text-slate-400">WhatsApp v1.0</p>
                                    </div>
                                    <a href="https://wa.me/919999578292" target="_blank" className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                                        <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Form */}
                    <div className="lg:col-span-8">
                        <div className="p-1 rounded-[2rem] bg-slate-200/40 border border-slate-200 shadow-xl">
                            <div className="bg-white rounded-[1.75rem] border border-slate-100 p-8 md:p-10 relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {!isSubmitted ? (
                                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center border border-brand-primary/10">
                                                    <MessageSquare size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900">Secure Transmission</h3>
                                                    <p className="text-xs text-slate-400 italic font-medium">Encrypted payload channel</p>
                                                </div>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full ID</label>
                                                        <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="Dr. Name" className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all text-sm font-medium" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Email</label>
                                                        <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="doctor@clinic.com" className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all text-sm font-medium" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Payload Message</label>
                                                    <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Protocol details..." className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all text-sm font-medium resize-none" />
                                                </div>

                                                <button disabled={isSubmitting} className={cn("w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-xl shadow-brand-primary/20", isSubmitting ? "bg-slate-900 text-white cursor-not-allowed" : "bg-brand-primary text-white hover:bg-brand-dark")}>
                                                    {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Tx Protocol...</> : <>Send Transaction <Send size={14} /></>}
                                                </button>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-emerald-50">
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 mb-2">Transmission Verified</h3>
                                            <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto mb-8">Signal encrypted and received.</p>
                                            <button onClick={() => setIsSubmitted(false)} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-800 transition-all">Return to Terminal</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Suspense } from "react";
export default function ContactPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-brand-primary" /></div>}>
            <ContactContent />
        </Suspense>
    );
}
