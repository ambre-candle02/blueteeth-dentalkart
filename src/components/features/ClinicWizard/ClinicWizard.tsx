"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Stethoscope, Scissors, Syringe, Building, Calculator, Calendar, MapPin, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitClinicSetup } from "@/actions/support-actions";
import { toast } from "sonner";

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
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<string[]>([]);
    const [loanAmount, setLoanAmount] = useState(500000);
    const [tenure, setTenure] = useState(12);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', clinicName: '', city: '', preferredTime: 'ASAP' });
    const [locationLoading, setLocationLoading] = useState(false);

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
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden  ">
            {/* Progress Bar */}
            <div className="bg-slate-50 border-b border-slate-100 p-6  ">
                <div className="flex justify-between mb-2 text-sm font-semibold text-slate-500 ">
                    <span>Clinic Type</span>
                    <span>Equipment</span>
                    <span>Finance</span>
                    <span>Consult</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden ">
                    <motion.div
                        className="h-full bg-brand-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            <div className="p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 ">Select Clinic Type</h2>
                            <p className="text-slate-500">Choose the primary focus of your new clinic implementation.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {CLINIC_TYPES.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={cn(
                                            "p-6 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 hover:shadow-md",
                                            selectedType === type.id
                                                ? "border-brand-primary bg-brand-light/20"
                                                : "border-slate-100 hover:border-brand-primary/50  "
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 rounded-full",
                                            selectedType === type.id ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-500 "
                                        )}>
                                            <type.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 ">{type.name}</h3>
                                            <p className="text-slate-500 text-sm">Est. Setup: ₹{type.price.toLocaleString()}</p>
                                        </div>
                                        {selectedType === type.id && <Check className="ml-auto text-brand-primary" />}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 ">Bundle Equipment</h2>
                            <p className="text-slate-500">Select essential equipment for your {CLINIC_TYPES.find(t => t.id === selectedType)?.name}.</p>

                            <div className="space-y-3">
                                {PACKAGES.map((pkg) => (
                                    <label key={pkg.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-50  ">
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

                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl ">
                                <span className="font-bold text-slate-500">Estimated Total</span>
                                <span className="text-2xl font-bold text-brand-dark ">₹{totalPrice.toLocaleString()}</span>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 ">
                                <Calculator className="text-brand-primary" /> Finance Calculuator
                            </h2>
                            <p className="text-slate-500">Plan your finances with our easy EMI options.</p>

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
                                        <span className="text-slate-500 font-medium">Monthly EMI</span>
                                        <span className="text-3xl font-bold text-brand-dark ">₹{Math.round(emi).toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">*Indicative rates. Subject to bank approval.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 text-center"
                        >
                            {!isSubmitted ? (
                                <>
                                    <div className="mb-8">
                                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-400/30 mb-4 animate-bounce">
                                            <Calendar size={32} />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Authorize Implementation</h2>
                                        <p className="text-slate-500 max-w-sm mx-auto text-[13px] font-medium mt-1">
                                            Register your clinic for a dedicated implementation protocol. Our specialist will contact you to finalize the blueprint.
                                        </p>
                                    </div>

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
                                        className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-lg mx-auto text-left space-y-6 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-3 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-blue-100">
                                            Protocol: CLN-2026
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Surgeon Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50"
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
                                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50"
                                                    placeholder="+91 99995 XXXXX"
                                                />
                                            </div>
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
                                            <div className="flex gap-2">
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.city}
                                                    onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                                                    className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:border-blue-500 transition-all bg-slate-50/50"
                                                    placeholder="Enter City/State"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={getLocation}
                                                    className="flex items-center gap-1.5 px-4 py-3 bg-white text-blue-600 border border-blue-100 rounded-2xl text-[11px] font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    {locationLoading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                                                    {locationLoading ? 'Syncing...' : 'Auto-Locate'}
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
                                            {submitLoading ? 'Registering Implementation...' : 'Confirm Implementation Authorization'}
                                        </button>
                                        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dedicated support sync within selected window</p>
                                    </form>
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
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between  ">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all   "
                    >
                        Back
                    </button>

                    {step < 4 && (
                        <button
                            onClick={nextStep}
                            disabled={step === 1 && !selectedType}
                            className="px-6 py-2 rounded-lg font-bold bg-brand-primary text-white hover:bg-brand-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Step <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
