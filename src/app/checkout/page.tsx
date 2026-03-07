"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { ArrowRight, ShieldCheck, Truck, CreditCard, Home, User, Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import Link from "next/link";
import { placeOrder, createRazorpayOrder, verifyAndPlaceOrder } from "@/actions/order-actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [orderError, setOrderError] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
    const [customerData, setCustomerData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        mobile: (session?.user as any)?.mobile || "",
        address: "",
        city: ""
    });

    const gstCount = cartTotal * 0.18;
    const finalTotalValue = cartTotal + gstCount;

    const handlePlaceOrder = async () => {
        if (!customerData.name || !customerData.email || !customerData.mobile || !customerData.address || !customerData.city) {
            setOrderError("Please fill in all fields.");
            return;
        }
        setOrderError("");
        setIsProcessing(true);
        try {
            const orderPayload = {
                items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
                totalAmount: finalTotalValue,
                customer: customerData
            };

            if (paymentMethod === "cod") {
                const result = await placeOrder({ ...orderPayload, paymentMethod: "COD" });
                if (result.success) {
                    setIsSuccess(true);
                    clearCart();
                    router.push(`/orders?success=true&id=${result.orderId}`);
                } else {
                    setOrderError(result.error || "Order failed. Please try again.");
                    setIsProcessing(false);
                }
            } else {
                // Online Payment
                const loaded = await new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });

                if (!loaded) {
                    setOrderError("Payment gateway failed to load. Please check your internet connection.");
                    setIsProcessing(false);
                    return;
                }

                const rzpResult = await createRazorpayOrder(orderPayload);

                if (!rzpResult.success) {
                    setOrderError(rzpResult.error || "Failed to create payment order.");
                    setIsProcessing(false);
                    return;
                }

                const options = {
                    key: rzpResult.key,
                    amount: rzpResult.amount,
                    currency: "INR",
                    name: "Blueteeth Dentalkart",
                    description: "Medical Supplies Payment",
                    order_id: rzpResult.razorpayOrderId,
                    handler: async function (response: any) {
                        setIsProcessing(true);
                        const verifyResult = await verifyAndPlaceOrder(rzpResult.dbOrderId, response, orderPayload);

                        if (verifyResult.success) {
                            setIsSuccess(true);
                            clearCart();
                            router.push(`/orders?success=true&id=${verifyResult.orderId}`);
                        } else {
                            setOrderError(verifyResult.error || "Payment verification failed.");
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: customerData.name,
                        email: customerData.email,
                        contact: customerData.mobile,
                    },
                    theme: { color: "#2563eb" },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false);
                        }
                    }
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', function (response: any) {
                    setOrderError(response.error.description || "Payment failed.");
                });
                rzp.open();
            }
        } catch (err) {
            console.error(err);
            setOrderError("Something went wrong. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) return alert("Geolocation not supported by your browser.");
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = await res.json();
                    const street = [data.locality, data.principalSubdivision].filter(Boolean).join(", ");
                    const city = data.city || data.locality || data.principalSubdivision || "";
                    setCustomerData(prev => ({
                        ...prev,
                        address: street || "",
                        city
                    }));
                } catch {
                    alert("Could not fetch address. Please enter manually.");
                } finally {
                    setIsLocating(false);
                }
            },
            (err) => {
                if (err.code === 1) alert("Location permission denied. Please allow access in browser settings.");
                else alert("Unable to get location. Please enter manually.");
                setIsLocating(false);
            }
        );
    };

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white focus:border-brand-primary/30 transition-all placeholder:text-slate-400";
    const labelClass = "text-xs font-semibold text-slate-500 mb-1.5 block";

    if (items.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFF] px-6 text-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800">No Items to Checkout</h1>
                <Link href="/shop" className="text-sm font-semibold text-brand-primary hover:underline">Browse Products →</Link>
            </div>
        );
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF]">
                <Loader2 className="animate-spin text-brand-primary" size={32} />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFF] px-6 text-center gap-4">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex flex-col items-center justify-center mb-2">
                    <User size={32} className="text-brand-primary" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Authentication Required 🛡️</h1>
                <p className="text-slate-500 max-w-sm mb-4">You need an active professional account to make any purchases or clinical transactions on Blueteeth.</p>
                <Link href="/login" className="bg-brand-primary text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-brand-dark transition-all transform active:scale-95 shadow-md shadow-brand-primary/20">
                    Sign In / Register <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-24 relative">
            {/* BG Decors */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-primary/[0.03] rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

            <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10 pt-10 relative z-10">
                <BackButton />

                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full rounded-3xl overflow-hidden mt-4 mb-8 bg-brand-primary/[0.04] border border-brand-primary/10 shadow-sm"
                >
                    <div className="flex items-center justify-between px-8 py-5 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20 shrink-0">
                                <ShieldCheck size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-brand-dark tracking-tight">Secure Checkout</h1>
                                <p className="text-xs text-slate-500 mt-0.5">Complete your order securely</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-sm text-emerald-600 font-semibold">
                            <Truck size={15} /> Free Delivery on all orders
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left — Form */}
                    <div className="lg:col-span-7 space-y-5">

                        {/* Personal Details */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                    <User size={16} className="text-brand-primary" />
                                </div>
                                <h2 className="text-base font-bold text-slate-800">Personal Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                        <input required type="text" placeholder="Dr. John Doe"
                                            value={customerData.name}
                                            onChange={e => setCustomerData({ ...customerData, name: e.target.value })}
                                            className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                        <input required type="email" placeholder="doctor@clinic.com"
                                            value={customerData.email}
                                            onChange={e => setCustomerData({ ...customerData, email: e.target.value })}
                                            className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                        <input required type="tel" placeholder="+91 99995-78292"
                                            value={customerData.mobile}
                                            onChange={e => setCustomerData({ ...customerData, mobile: e.target.value })}
                                            className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>City</label>
                                    <input required type="text" placeholder="Mumbai"
                                        value={customerData.city}
                                        onChange={e => setCustomerData({ ...customerData, city: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white focus:border-brand-primary/30 transition-all placeholder:text-slate-400" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Shipping Address</label>
                                    <div className="relative group">
                                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                        <input required type="text" placeholder="Clinic Name, Floor, Building, Street"
                                            value={customerData.address}
                                            onChange={e => setCustomerData({ ...customerData, address: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-32 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white focus:border-brand-primary/30 transition-all placeholder:text-slate-400" />
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            disabled={isLocating}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-brand-primary hover:bg-brand-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-60 shrink-0"
                                        >
                                            {isLocating
                                                ? <><Loader2 size={11} className="animate-spin" /> Locating</>
                                                : <><MapPin size={11} /> Locate Me</>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Method */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                    <CreditCard size={16} className="text-brand-primary" />
                                </div>
                                <h2 className="text-base font-bold text-slate-800">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label onClick={() => setPaymentMethod("online")}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "online"
                                        ? "border-brand-primary bg-brand-primary/[0.02]"
                                        : "border-slate-200 hover:border-brand-primary/30"
                                        }`}>
                                    <input type="radio" name="payment" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="hidden" />
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === "online" ? "border-brand-primary" : "border-slate-300"
                                        }`}>
                                        {paymentMethod === "online" && <div className="w-2 h-2 rounded-full bg-brand-primary" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Online Payment</p>
                                        <p className="text-xs text-slate-500">Razorpay / UPI / Cards</p>
                                    </div>
                                    <CreditCard className="text-brand-primary/40 ml-auto" size={18} />
                                </label>
                                <label onClick={() => setPaymentMethod("cod")}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "cod"
                                        ? "border-brand-primary bg-brand-primary/[0.02]"
                                        : "border-slate-200 hover:border-brand-primary/30"
                                        }`}>
                                    <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="hidden" />
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === "cod" ? "border-brand-primary" : "border-slate-300"
                                        }`}>
                                        {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-brand-primary" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Cash on Delivery</p>
                                        <p className="text-xs text-slate-500">Pay when delivered</p>
                                    </div>
                                </label>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — Summary (Sticky) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
                        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm">

                            {/* Title bar */}
                            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
                                <h2 className="text-base font-bold text-slate-800">Order Summary</h2>
                                <span className="text-xs font-semibold bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full">{items.length} items</span>
                            </div>

                            {/* Items */}
                            <div className="px-5 py-3 space-y-2.5 border-b border-slate-100">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-slate-700 line-clamp-1 font-medium">{item.name}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Qty {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-800 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="px-5 py-3 space-y-2 border-b border-slate-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="text-slate-700 font-medium">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">GST (18%)</span>
                                    <span className="text-slate-700 font-medium">₹{gstCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Delivery</span>
                                    <span className="text-emerald-600 font-semibold flex items-center gap-1"><Truck size={12} /> Free</span>
                                </div>
                            </div>

                            {/* Total + Button */}
                            <div className="px-5 py-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-slate-800">Total</span>
                                    <span className="text-2xl font-bold text-brand-primary">₹{finalTotalValue.toLocaleString()}</span>
                                </div>

                                {orderError && (
                                    <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center">
                                        {orderError}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="w-full bg-brand-primary hover:bg-brand-dark text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-brand-primary/25 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isProcessing
                                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                                        : <>Confirm Order <ArrowRight size={15} /></>
                                    }
                                </button>

                                <div className="flex items-center justify-center gap-3 text-sm text-slate-400">
                                    <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-primary/60" /> Razorpay Secured</span>
                                    <span className="text-slate-200">|</span>
                                    <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500/70" /> 100% Genuine</span>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </div >
    );
}
