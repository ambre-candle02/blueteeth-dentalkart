"use client";

import { Suspense, useState, useActionState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from '@/actions/auth-actions';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams?.get('token') || '';
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [actionState, formAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            if (password !== confirmPassword) {
                return { success: false, message: "Passwords do not match." };
            }
            formData.append('token', token);
            const result = await confirmPasswordReset(formData);
            return result;
        },
        null
    );

    if (!token) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50/50">
                <div className="max-w-md w-full text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Invalid Link</h2>
                    <p className="text-slate-500 font-medium mb-10">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link href="/forgot-password" title="Request New Link" className="text-brand-primary font-black uppercase tracking-widest text-sm hover:text-brand-dark transition-colors">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

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
                    <div className="absolute inset-0 bg-white/30" />

                    <div className="relative z-10 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-brand-primary/20 border border-brand-primary/10"
                        >
                            <KeyRound className="text-brand-primary w-12 h-12" strokeWidth={2.5} />
                        </motion.div>

                        <h3 className="text-4xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
                            New <span className="text-brand-primary">Security</span>
                        </h3>
                        <p className="text-slate-600 font-bold text-lg max-w-xs mx-auto leading-relaxed">
                            Set a strong password to protect your clinical workspace.
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                    {!actionState?.success ? (
                        <>
                            <div className="mb-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6">
                                    Secure Access
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Reset Password</h2>
                                <p className="text-slate-500 font-medium">Please enter your registered email and a new password.</p>
                            </div>

                            <form action={formAction} className="space-y-6">
                                <div className="group">
                                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary/60 mb-2.5 ml-1">
                                        Verification Email
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all font-bold text-slate-900 shadow-sm"
                                        placeholder="doctor@clinic.com"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary/60 mb-2.5 ml-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all font-bold text-slate-900 shadow-sm"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary/60 mb-2.5 ml-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all font-bold text-slate-900 shadow-sm"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {actionState?.message && (
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
                                    {isPending ? "Updating..." : <>Update Password <ArrowRight size={20} /></>}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                                <CheckCircle2 size={40} strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Password Updated</h2>
                            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                                Your security credentials have been updated. You can now access your professional portal.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3.5 rounded-2xl font-black hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
                            >
                                Sign in to Portal <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}

                    <div className="mt-12 text-center text-slate-400 font-black text-[11px] uppercase tracking-widest">
                        Blueteeth Dental Security Network
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
