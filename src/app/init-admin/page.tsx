"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminSetupPage() {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const createAdmin = async () => {
        setStatus('pending');
        try {
            const response = await fetch('/api/admin/setup', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.message);
            }
        } catch (err) {
            setStatus('error');
            setMessage('Failed to connect to setup API.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100"
            >
                <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-brand-primary/20">
                    <ShieldCheck className="text-brand-primary w-10 h-10" />
                </div>

                <h1 className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tight">Admin System Setup</h1>
                <p className="text-slate-500 text-center font-medium mb-10">
                    Initialize your admin account if login is not working due to missing credentials.
                </p>

                {status === 'success' ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                        <CheckCircle2 className="text-emerald-500 w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-emerald-900 font-black text-xl mb-2">Success!</h3>
                        <p className="text-emerald-700 font-medium mb-6">{message}</p>
                        <a href="/login" className="block w-full bg-emerald-500 text-white py-4 rounded-xl font-black hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
                            Login Now
                        </a>
                    </div>
                ) : (
                    <>
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8 flex items-start gap-4">
                            <AlertCircle className="text-amber-500 shrink-0 mt-1" />
                            <p className="text-sm text-amber-900 font-bold leading-relaxed">
                                This will create an account: <span className="text-brand-primary">admin@dentalkart.com</span> with password <span className="text-brand-primary">Admin@123</span>
                            </p>
                        </div>

                        <button
                            onClick={createAdmin}
                            disabled={status === 'pending'}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {status === 'pending' ? 'Configuring System...' : <><UserPlus size={20} /> Create Admin Account</>}
                        </button>

                        {status === 'error' && (
                            <p className="mt-4 text-red-600 text-center font-black text-sm uppercase tracking-tight">{message}</p>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}
