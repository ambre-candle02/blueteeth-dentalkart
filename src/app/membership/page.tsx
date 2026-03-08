"use client";

import { Check, Crown, Shield, Zap, ArrowLeft, ArrowRight, Sparkles, Star, Award, ShieldCheck, CheckCircle2, Building2, TrendingUp, Handshake, Phone, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BackButton } from "@/components/ui/BackButton";
import { getMembershipPlans, requestMembershipUpgrade } from "@/actions/membership-actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import * as Icons from "lucide-react";

// Fallback plans in case DB is empty
const DEFAULT_PLANS = [
    {
        name: "Clinical Lite",
        price: 0,
        desc: "Essential procurement for growing clinics",
        features: ["Standard Logistics", "Portal Access", "B2B Invoicing", "Monthly Statements"],
        icon: "Building2",
        color: "slate",
        highlight: false
    },
    {
        name: "Professional",
        price: 4999,
        period: "/ YEAR",
        desc: "Advanced toolkit for established practices",
        features: ["Priority Logistics", "Dedicated Manager", "Custom Pricing", "Advanced Analytics", "Extended Warranty"],
        icon: "Crown",
        color: "indigo",
        highlight: true
    },
    {
        name: "Enterprise",
        price: 14999,
        period: "/ YEAR",
        desc: "Complete supply chain for large clinics",
        features: ["Same-Day Logistics", "API Integration", "Quarterly Audits", "White-glove Support"],
        icon: "Sparkles",
        color: "amber",
        highlight: false
    }
];

export default function MembershipPage() {
    const { data: session } = useSession();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');

    useEffect(() => {
        const fetchPlans = async () => {
            const result = await getMembershipPlans();
            if (result.success && result.plans && result.plans.length > 0) {
                setPlans(result.plans);
            } else {
                setPlans(DEFAULT_PLANS);
            }
            setLoading(false);
        };
        fetchPlans();
    }, []);

    const handleUpgrade = (plan: any) => {
        if (plan.price === 0) return;
        setSelectedPlan(plan);
        setStep('selection');
    };

    const processPayment = async () => {
        if (!session?.user) {
            toast.error("Please login to request an upgrade.");
            return;
        }

        setStep('processing');
        try {
            // Send real email to admin
            const result = await requestMembershipUpgrade({
                name: session.user.name || "N/A",
                email: session.user.email || "N/A"
            }, selectedPlan);

            if (result.success) {
                setStep('success');
            } else {
                toast.error("Protocol Error: Unable to sync with gateway.");
                setStep('selection');
            }
        } catch (error) {
            console.error("Payment Protocol Failed:", error);
            setStep('selection');
        }
    };

    return (
        <div className="bg-[#FAFBFF] min-h-screen pb-16 relative overflow-hidden font-sans">
            {/* Immersive Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-primary/[0.03] to-transparent pointer-events-none" />

            <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
                {/* Unified Header Style */}
                <div className="pt-4 md:pt-8 mb-6 md:mb-12">
                    <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-6 md:mb-10">
                        <div className="relative p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 overflow-hidden">
                            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/[0.02] to-transparent pointer-events-none" />

                            <div className="flex items-center gap-3 md:gap-6 relative z-10 w-full md:w-auto">
                                <BackButton className="w-8 h-8 md:w-12 md:h-12" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                                        <h1 className="text-lg md:text-2xl font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">Clinical Tiers</h1>
                                        <div className="px-2 md:px-3 py-1.5 md:py-1 bg-brand-primary/5 border border-brand-primary/10 rounded-lg shrink-0">
                                            <span className="text-brand-primary text-[8px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Premium Portal</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] md:text-sm text-slate-500 font-medium line-clamp-1 md:line-clamp-none">Empowering 12,000+ certified clinical partners worldwide.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="px-4 py-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-white" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Gateway</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight whitespace-nowrap">
                            Optimize Your <span className="text-brand-primary">Supply Chain</span>
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto text-[11px] md:text-sm font-medium px-4 md:px-0">
                            Select a professional procurement tier designed for clinical outcome brilliance.
                        </p>
                    </div>
                </div>

                {/* Plans Grid */}
                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {plans.map((plan, i) => {
                            const Icon = (Icons as any)[plan.icon || (i === 0 ? "Building2" : i === 1 ? "Crown" : "Sparkles")] || Icons.Award;
                            const isHighlight = plan.highlight !== undefined ? plan.highlight : (plans.length === 3 && i === 1);
                            const planColor = plan.color || (i === 0 ? 'slate' : i === 1 ? 'indigo' : 'amber');

                            return (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="h-full"
                                >
                                    <div className={cn(
                                        "h-full w-full p-6 md:p-10 rounded-3xl transition-all flex flex-col relative",
                                        isHighlight
                                            ? "bg-white border-2 border-brand-primary shadow-2xl shadow-brand-primary/10 z-10 md:scale-105"
                                            : planColor === 'amber'
                                                ? "bg-gradient-to-br from-amber-50/60 to-white border border-amber-200/60 shadow-sm hover:shadow-xl transition-all"
                                                : planColor === 'slate'
                                                    ? "bg-gradient-to-br from-slate-50/60 to-white border border-slate-200/60 shadow-sm hover:shadow-xl transition-all"
                                                    : "bg-gradient-to-br from-blue-50/60 to-white border border-blue-200/60 shadow-sm hover:shadow-xl transition-all"
                                    )}>
                                        {isHighlight && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20">
                                                <Star size={12} className="fill-white" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">Recommended Choice</span>
                                            </div>
                                        )}

                                        <div className="mb-4 md:mb-6">
                                            <div className={cn(
                                                "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-5 transition-transform group-hover:scale-110",
                                                planColor === 'slate' ? 'bg-slate-100 text-slate-600' :
                                                    planColor === 'amber' ? 'bg-amber-100 text-amber-600' :
                                                        'bg-indigo-100 text-indigo-600'
                                            )}>
                                                <Icon size={20} />
                                            </div>
                                            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-1 md:mb-1.5 tracking-tight">{plan.name}</h3>
                                            <p className="text-[10px] md:text-[11px] text-slate-400 font-semibold mb-4 md:mb-6">{plan.desc}</p>

                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl md:text-3xl font-bold text-slate-900">
                                                    {plan.price === 0 ? "FREE" : `₹${plan.price.toLocaleString()}`}
                                                </span>
                                                {plan.price > 0 && <span className="text-slate-400 font-bold text-[10px] md:text-xs">{plan.period}</span>}
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-1">
                                            <div className="h-px bg-slate-100 w-full mb-3 md:mb-4" />
                                            {plan.features.map((feature: string, idx: number) => (
                                                <div key={idx} className="flex items-start gap-2 md:gap-3">
                                                    <div className="mt-0.5 md:mt-1 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                                        <Check size={10} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[11px] md:text-[13px] font-medium text-slate-600 leading-tight">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action */}
                                        <button
                                            onClick={() => plan.price === 0 ? toast.info("Success: Your clinical environment is already synchronized with this tier protocol.") : handleUpgrade(plan)}
                                            className={cn(
                                                "w-full py-4 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95",
                                                isHighlight
                                                    ? "bg-brand-primary text-white hover:bg-brand-dark shadow-lg shadow-brand-primary/20"
                                                    : plan.price === 0
                                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 active:bg-emerald-200"
                                                        : "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20"
                                            )}
                                        >
                                            {plan.price === 0 ? "Active Deployment" : "Authorize Tier"} <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-28 mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1">
                        <div className="w-16 h-16 bg-blue-100/50 text-blue-600 rounded-[1.25rem] flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner">
                            <Building2 size={28} />
                        </div>
                        <div>
                            <span className="text-3xl font-black text-slate-900 block tracking-tighter">12k+</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/70">Certified Clinics</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-emerald-500/10 transition-all hover:-translate-y-1">
                        <div className="w-16 h-16 bg-emerald-100/50 text-emerald-600 rounded-[1.25rem] flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <span className="text-3xl font-black text-slate-900 block tracking-tighter">100%</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70">Tax Compliant</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-[2.5rem] border border-amber-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-amber-500/10 transition-all hover:-translate-y-1">
                        <div className="w-16 h-16 bg-amber-100/50 text-amber-600 rounded-[1.25rem] flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner">
                            <Zap size={28} />
                        </div>
                        <div>
                            <span className="text-3xl font-black text-slate-900 block tracking-tighter">24/7</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600/70">Live Logistics</span>
                        </div>
                    </div>
                </div>

                {/* Direct Support Section - Softened Colors */}
                <div className="mt-8 mb-20 text-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-10 px-12 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mr-2">Contact Protocol:</p>

                        <a href="tel:+919999578292" className="flex items-center gap-4 text-slate-700 hover:text-blue-600 transition-all group">
                            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                                <Phone size={18} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Voice Line</span>
                                <span className="text-[15px] font-black tracking-tight text-slate-800">+91 99995 78292</span>
                            </div>
                        </a>

                        <a href="https://wa.me/919999578292" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-700 hover:text-emerald-500 transition-all group">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                                <MessageCircle size={20} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">WhatsApp Live</span>
                                <span className="text-[15px] font-black tracking-tight text-slate-800">Support Sync</span>
                            </div>
                        </a>

                        <a href="mailto:support@blueteeth.store" className="flex items-center gap-4 text-slate-700 hover:text-red-500 transition-all group">
                            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                                <Mail size={18} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Internal Mail</span>
                                <span className="text-[15px] font-black tracking-tight text-slate-800">support@blueteeth.store</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* SECURE CHECKOUT MODAL */}
            <AnimatePresence>
                {selectedPlan && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden relative"
                        >
                            {step === 'selection' && (
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-lg font-bold text-slate-900">Elite Authorization</h2>
                                        <button onClick={() => setSelectedPlan(null)} className="text-slate-300 hover:text-slate-600 transition-colors">
                                            <ArrowLeft size={20} />
                                        </button>
                                    </div>

                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8 flex justify-between items-center">
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Tier</p>
                                            <h3 className="text-base font-bold text-slate-800">{selectedPlan.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Amount</p>
                                            <p className="text-lg font-bold text-brand-primary">₹{selectedPlan.price.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={processPayment}
                                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-primary transition-all active:scale-95"
                                    >
                                        Initialize Protocol
                                    </button>
                                </div>
                            )}

                            {step === 'processing' && (
                                <div className="p-16 text-center space-y-6">
                                    <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin mx-auto" />
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Authenticating...</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Syncing with Secure Gateway</p>
                                    </div>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg mb-6">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Protocol Verified</h3>
                                    <p className="text-slate-500 font-medium text-xs mb-8">Your clinical partner tier has been authorized. Welcome to the network.</p>
                                    <button
                                        onClick={() => setSelectedPlan(null)}
                                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary transition-all"
                                    >
                                        Proceed to Dashboard
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
