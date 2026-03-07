"use client";

import { useState, useActionState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { requestPasswordReset } from '@/actions/auth-actions';

export default function ForgotPasswordPage() {
    const [actionState, formAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await requestPasswordReset(formData);
            return result;
        },
        null
    );

    const [email, setEmail] = useState('');

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 overflow-hidden flex flex-col md:flex-row border border-slate-100"
            >
                {/* Visual Side */}
                <div className="md:w-1/2 relative min-h-[400px] md:min-h-[600px] flex items-center justify-center p-12 overflow-hidden bg-slate-100">
                    <img
                        src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1772822751/media-hub/dnyb0ucmcabfwn01ocru.png"
                        alt="Restoration"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Soft gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-white/30" />

                    <div className="relative z-10 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-brand-primary/20 border border-brand-primary/10"
                        >
                            <ShieldCheck className="text-brand-primary w-12 h-12" strokeWidth={2.5} />
                        </motion.div>

                        <h3 className="text-4xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
                            Account <span className="text-brand-primary">Recovery</span>
                        </h3>
                        <p className="text-slate-600 font-bold text-lg max-w-xs mx-auto leading-relaxed">
                            Restore your access to the professional supply network.
                        </p>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 border-[40px] border-brand-primary/5 rounded-full" />
                        <div className="absolute bottom-[-15%] left-[-15%] w-96 h-96 border-[60px] border-brand-primary/5 rounded-full" />
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                    {!actionState?.success ? (
                        <>
                            <div className="mb-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6">
                                    Security Verification
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Forgot Password?</h2>
                                <p className="text-slate-500 font-medium">Enter your registered email to receive a reset link.</p>
                            </div>

                            <form action={formAction} className="space-y-6">
                                <div className="group">
                                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary/60 mb-2.5 ml-1 transition-colors group-focus-within:text-brand-primary">
                                        Registered Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all font-bold text-slate-900 shadow-sm"
                                            placeholder="doctor@clinic.com"
                                        />
                                    </div>
                                </div>

                                {actionState?.message && !actionState.success && (
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        <p className="text-xs font-black text-red-600 uppercase tracking-tighter">{actionState.message}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-brand-primary text-white py-4.5 rounded-2xl font-black text-lg hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                                >
                                    {isPending ? "Sending Link..." : <>Send Reset Link <ArrowRight size={20} /></>}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                                <CheckCircle2 size={40} strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Check Your Inbox</h2>
                            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                                {actionState.message}
                            </p>
                            <Link
                                href="/login"
                                className="text-brand-primary font-black hover:text-brand-dark transition-colors"
                            >
                                Return to Login
                            </Link>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-900 transition-colors">
                            <ArrowLeft size={14} /> Back to Hub Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
