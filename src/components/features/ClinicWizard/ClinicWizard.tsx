"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Stethoscope, Scissors, Syringe, Building, Calculator, Calendar, MapPin, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitClinicSetup } from "@/actions/support-actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";
import { User, LogIn } from "lucide-react";

const CLINIC_TYPES = [
    { id: "general", name: "General Dentistry", icon: Stethoscope, price: 500000 },
    { id: "ortho", name: "Orthodontics", icon: Scissors, price: 650000 },
    { id: "surgery", name: "Oral Surgery", icon: Syringe, price: 800000 },
    { id: "multi", name: "Multi-Specialty", icon: Building, price: 1200000 },
];

const PACKAGES = [
    { id: "chair", name: "Premium Dental Chair", price: 150000 },
    { id: "xray", name: "Digital X-Ray System", price: 85000 },
    { id: "autoclave", name: "Class B Autoclave", price: 45000 },
    { id: "compressor", name: "Oil-Free Compressor", price: 25000 },
    { id: "handpieces", name: "Handpiece Set", price: 15000 },
];

export function ClinicWizard() {
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<string[]>([]);
    const [loanAmount, setLoanAmount] = useState(500000);
    const [tenure, setTenure] = useState(12);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', clinicName: '', city: '', preferredTime: 'ASAP' });
    const [locationLoading, setLocationLoading] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user?.name || '',
                email: session.user?.email || ''
            }));
        }
    }, [session]);

    const getLocation = () => {
        if (!navigator.geolocation) return;
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
                    const data = await res.json();
                    const city = data.address?.city || data.address?.town || data.address?.state_district || data.address?.state || 'Location detected';
                    setFormData(prev => ({ ...prev, city }));
                } catch {
                    setFormData(prev => ({ ...prev, city: 'Location detected' }));
                } finally {
                    setLocationLoading(false);
                }
            },
            () => setLocationLoading(false)
        );
    };

    const basePrice = CLINIC_TYPES.find(t => t.id === selectedType)?.price || 0;
    const packagePrice = PACKAGES.filter(p => selectedPackage.includes(p.id)).reduce((acc, p) => acc + p.price, 0);
    const totalPrice = basePrice + packagePrice;

    // EMI Calculation
    const interestRate = 12; // 12%
    const monthlyInterest = interestRate / 12 / 100;
    const emi = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, tenure)) / (Math.pow(1 + monthlyInterest, tenure) - 1);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="max-w-[1000px] mx-2 md:mx-auto bg-white rounded-2xl md:rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] border-2 border-brand-primary/20 overflow-hidden relative group/wizard">
            {/* Ultra-Compact Progress Architecture */}
            <div className="bg-white border-b border-slate-50 p-4 md:p-6 relative overflow-hidden">
                <div className="flex justify-between mb-4 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap overflow-x-auto no-scrollbar gap-8 md:gap-0 px-2">
                    <span className={cn("transition-all duration-700", step >= 1 ? "text-brand-primary" : "opacity-60")}>I. Blueprint</span>
                    <span className={cn("transition-all duration-700", step >= 2 ? "text-brand-primary" : "opacity-60")}>II. Tech</span>
                    <span className={cn("transition-all duration-700", step >= 3 ? "text-brand-primary" : "opacity-60")}>III. Equity</span>
                    <span className={cn("transition-all duration-700", step >= 4 ? "text-brand-primary" : "opacity-60")}>IV. Launch</span>
                </div>
                <div className="h-[2px] bg-slate-100 rounded-full overflow-hidden relative mx-2">
                    <motion.div
                        className="h-full bg-brand-primary relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-shimmer" />
                    </motion.div>
                </div>
            </div>

            <div className="p-3 md:p-12 min-h-[300px] md:min-h-[450px]">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="space-y-6 md:space-y-8"
                        >
                            <div className="space-y-2">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none italic">Select Clinic <span className="text-brand-primary">Focus</span></h2>
                                <p className="text-[10px] md:text-sm text-slate-500 font-medium opacity-60 italic">Define the core implementation protocol for your new establishment.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {CLINIC_TYPES.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={cn(
                                            "p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 group/card relative overflow-hidden",
                                            selectedType === type.id
                                                ? "border-brand-primary bg-brand-primary/5 shadow-xl shadow-brand-primary/5"
                                                : "border-slate-100 hover:border-brand-primary/20 hover:shadow-lg bg-slate-50/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover/card:scale-105",
                                            selectedType === type.id ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" : "bg-white text-slate-400 border border-slate-100 shadow-sm"
                                        )}>
                                            <type.icon className="w-6 h-6 md:w-8 md:h-8" />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-sm md:text-lg font-black text-slate-900 leading-tight">{type.name}</h3>
                                            <p className="text-[9px] md:text-[10px] font-black text-brand-primary uppercase tracking-widest mt-1">Est. ₹{type.price.toLocaleString()}</p>
                                        </div>
                                        {selectedType === type.id && (
                                            <div className="absolute top-3 right-3 text-brand-primary bg-white rounded-full p-1 shadow-sm">
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="space-y-6 md:space-y-8"
                        >
                            <div className="space-y-2">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none italic">Bundle <span className="text-brand-primary">Technology</span></h2>
                                <p className="text-[10px] md:text-sm text-slate-500 font-medium opacity-60 italic">Curate your clinical inventory from our peak-tier equipment catalog.</p>
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                {PACKAGES.map((pkg) => (
                                    <label key={pkg.id} className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-50  ">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedPackage.includes(pkg.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedPackage([...selectedPackage, pkg.id]);
                                                    else setSelectedPackage(selectedPackage.filter(id => id !== pkg.id));
                                                }}
                                                className="w-5 h-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                                            />
                                            <span className="font-medium text-slate-900 ">{pkg.name}</span>
                                        </div>
                                        <span className="font-bold text-slate-900 ">₹{pkg.price.toLocaleString()}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-between items-center p-3 md:p-4 bg-slate-50 rounded-lg md:rounded-xl ">
                                <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Estimated Total</span>
                                <span className="text-lg md:text-2xl font-black text-brand-dark tracking-tighter ">₹{totalPrice.toLocaleString()}</span>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="space-y-6 md:space-y-8"
                        >
                            <div className="space-y-2">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none italic flex items-center gap-3">
                                    <Calculator className="text-brand-primary" size={28} /> Financial <span className="text-brand-primary">Architect</span>
                                </h2>
                                <p className="text-[10px] md:text-sm text-slate-500 font-medium opacity-60 italic">Engineered EMI solutions tailored for clinical scalability.</p>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-xl space-y-8 ">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-slate-700 ">Loan Amount</span>
                                        <span className="font-bold text-brand-primary">₹{loanAmount.toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100000"
                                        max="5000000"
                                        step="50000"
                                        value={loanAmount}
                                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                                        className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-brand-primary "
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-slate-700 ">Tenure (Months)</span>
                                        <span className="font-bold text-brand-primary">{tenure} Months</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="12"
                                        max="60"
                                        step="6"
                                        value={tenure}
                                        onChange={(e) => setTenure(Number(e.target.value))}
                                        className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-brand-primary "
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-200 ">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Monthly EMI</span>
                                        <span className="text-xl md:text-3xl font-bold text-brand-dark ">₹{Math.round(emi).toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 font-medium">*Indicative rates. Subject to bank approval.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="space-y-6 md:space-y-8 text-center"
                        >
                            {!isSubmitted ? (
                                <>
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 md:w-20 md:h-20 bg-brand-primary text-white rounded-xl md:rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-brand-primary/20 mb-2 md:mb-4 animate-pulse">
                                            <Calendar className="w-6 h-6 md:w-10 md:h-10" />
                                        </div>
                                        <h2 className="text-xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">Authorize <span className="text-brand-primary">Setup</span></h2>
                                        <p className="text-[10px] md:text-lg text-slate-500 max-w-xs mx-auto font-medium opacity-60 italic leading-relaxed">
                                            Initialize your clinical blueprint. Our senior engineers will sync for the implementation deep-dive.
                                        </p>
                                    </div>

                                    {!session ? (
                                        <div className="bg-white p-6 md:p-10 rounded-3xl border-2 border-brand-primary/10 shadow-2xl shadow-slate-200/50 max-w-lg mx-2 md:mx-auto text-center space-y-6 relative overflow-hidden">
                                            <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-2">
                                                <User size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Identity Verification Required</h3>
                                                <p className="text-sm text-slate-500 mt-2 font-medium italic">Please log in to your professional account to authorize this clinical implementation.</p>
                                            </div>
                                            <Link
                                                href="/login"
                                                className="flex items-center justify-center gap-2 w-full bg-brand-primary text-white font-black py-4 rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20"
                                            >
                                                <LogIn size={18} />
                                                Account Login
                                            </Link>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure portal for registered healthcare professionals</p>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                setSubmitLoading(true);
                                                try {
                                                    const setupDetails = {
                                                        type: CLINIC_TYPES.find(t => t.id === selectedType)?.name || 'General',
                                                        packages: PACKAGES.filter(p => selectedPackage.includes(p.id)).map(p => p.name),
                                                        totalPrice,
                                                        loanAmount,
                                                        tenure,
                                                        emi: Math.round(emi)
                                                    };
                                                    const result = await submitClinicSetup(formData, setupDetails);
                                                    if (result.success) {
                                                        setIsSubmitted(true);
                                                        toast.success("Implementation Authorized!");
                                                    } else {
                                                        toast.error(result.error || "Authorization Failed");
                                                    }
                                                } catch (err) {
                                                    toast.error("Technical Error");
                                                } finally {
                                                    setSubmitLoading(false);
                                                }
                                            }}
                                            className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 border-slate-50 shadow-2xl shadow-slate-200/50 max-w-lg mx-2 md:mx-auto text-left space-y-4 md:space-y-6 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-2 md:p-3 bg-blue-50 text-blue-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-blue-100">
                                                CLN-2026
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Surgeon Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs md:text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50"
                                                        placeholder="Dr. Rajesh Mehra"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Direct Line</label>
                                                    <input
                                                        required
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs md:text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50"
                                                        placeholder="+91 99995 XXXXX"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Contact Email</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs md:text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50"
                                                    placeholder="doctor@example.com"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Establishment Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.clinicName}
                                                    onChange={e => setFormData(p => ({ ...p, clinicName: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50"
                                                    placeholder="e.g. Smile Dental Care & Implant Center"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Deployment Location</label>
                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:border-blue-500 transition-all bg-slate-50/50"
                                                        placeholder="Enter City/State"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={getLocation}
                                                        className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-3 bg-white text-blue-600 border border-blue-100 rounded-2xl text-[10px] md:text-[11px] font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm shrink-0"
                                                    >
                                                        {locationLoading ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />}
                                                        {locationLoading ? 'Sync...' : 'Locate Position'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-200/60">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 text-center">Preferred Call Sync Time</label>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {['ASAP', 'Morning (10-1)', 'Afternoon (2-5)', 'Evening (6-9)'].map((time) => (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            onClick={() => setFormData(p => ({ ...p, preferredTime: time }))}
                                                            className={cn(
                                                                "px-4 py-2 rounded-xl text-[11px] font-black transition-all border",
                                                                formData.preferredTime === time
                                                                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                                                                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600"
                                                            )}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={submitLoading}
                                                className="w-full bg-blue-600 text-white font-black py-4 rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                                            >
                                                {submitLoading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                                                <span className="text-[10px] md:text-xs">
                                                    {submitLoading ? 'Registering Implementation...' : 'Confirm Implementation Authorization'}
                                                </span>
                                            </button>
                                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dedicated support sync within selected window</p>
                                        </form>
                                    )}
                                </>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="py-12"
                                >
                                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-6">
                                        <Check size={50} />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
                                    <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                        Thank you, Doctor. Our setup specialist will contact you shortly to discuss your custom plan.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            setIsSubmitted(false);
                                            setSelectedType(null);
                                            setSelectedPackage([]);
                                        }}
                                        className="px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Start New Setup
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            {!isSubmitted && (
                <div className="p-3 md:p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className="flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        Previous
                    </button>

                    {step < 4 && (
                        <button
                            onClick={nextStep}
                            disabled={step === 1 && !selectedType}
                            className="flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20"
                        >
                            Next <ArrowRight size={14} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
