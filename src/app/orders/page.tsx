"use client";

import { useSession } from "next-auth/react";
import { Package, Truck, CheckCircle2, ArrowRight, Clock, HelpCircle, ShoppingBag, Sparkles, Filter, Search, Download, ExternalLink, Calendar, CreditCard, ShieldCheck, ChevronDown } from "lucide-react";
import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getUserOrders } from "@/actions/order-actions";
import { useSearchParams, useRouter } from "next/navigation";

function OrdersPageContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [realOrders, setRealOrders] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'info' } | null>(null);

    const todayDate = useMemo(() => {
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()).toUpperCase();
    }, []);

    const showNotification = (msg: string, type: 'success' | 'info' = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        async function load() {
            const data = await getUserOrders();
            setRealOrders(data);
            setIsLoading(false);
        }
        load();

        if (searchParams.get('success') === 'true') {
            showNotification("Order Synchronized Successfully. Elite Protocol Initiated.", 'success');
        }
    }, [searchParams]);

    const filteredOrders = useMemo(() => {
        return realOrders.filter(order => {
            const matchesSearch = (order.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.items?.some((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === "All" || order.status?.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, realOrders]);

    const handleAction = async (id: string, actionType: 'download' | 'invoice' | 'track' | 'support' | 'filter') => {
        setLoadingStates(prev => ({ ...prev, [id]: true }));
        await new Promise(resolve => setTimeout(resolve, 400));

        const orderId = id.replace(/^(invoice|track|support|download)-/, '');
        const order = realOrders.find(o => o.id === orderId);

        if (actionType === 'download') {
            const headers = "Order ID,Date,Product,Price,Quantity,Status,Total\n";
            const rows = filteredOrders.map((o: any) =>
                `${o.id},${o.date},${o.items[0].name},${o.items[0].price},${o.items[0].quantity},${o.status},${o.total}`
            ).join('\n');
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Orders_Statement_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            showNotification("Statement Downloaded Successfully", 'success');
        }

        if (actionType === 'invoice' && order) {
            window.open(`/invoice/${orderId}`, '_blank');
        }

        if (actionType === 'track' && order) {
            router.push(`/track/${orderId}`);
        }

        if (actionType === 'support' && order) {
            router.push(`/contact?orderId=${orderId}`);
        }

        setLoadingStates(prev => ({ ...prev, [id]: false }));
    };

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-16 relative font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-brand-primary/[0.03] to-transparent" />
            </div>

            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[300] px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-4 min-w-[300px] ${notification.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-brand-primary text-white border-brand-primary'}`}
                    >
                        <CheckCircle2 size={18} />
                        <span className="text-xs font-bold">{notification.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-14 pt-8">
                {/* Integrated Header "Patti" */}
                <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden mb-8 md:mb-10">
                    <div className="relative p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/[0.03] to-transparent pointer-events-none" />

                        <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
                            <BackButton className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl shrink-0" />
                            <div className="min-w-0">
                                <div className="flex flex-col-reverse md:flex-row md:items-center gap-1 md:gap-3 mb-1 md:mb-0">
                                    <h1 className="text-xl md:text-4xl font-black text-slate-900 tracking-tighter truncate">Order <span className="text-brand-primary">Activity</span></h1>
                                    <span className="w-fit bg-brand-primary/5 text-brand-primary text-[8px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-brand-primary/10">
                                        {realOrders.length} Protocols
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-sm text-slate-400 font-medium leading-tight">Tracking clinical supplies and equipment procurement.</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 md:gap-4 relative z-10 w-full md:w-auto mt-2 md:mt-0">
                            <div className="hidden sm:flex px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 items-center gap-2">
                                <Calendar size={14} className="text-brand-primary" />
                                {todayDate}
                            </div>
                            <button
                                onClick={() => handleAction('download', 'download')}
                                className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
                            >
                                <Download size={14} /> Export Statement
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                    <div className="relative w-full md:max-w-md">
                        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search clinical records..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-100 px-6 py-3.5 pr-12 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-slate-600 focus:outline-none cursor-pointer hover:bg-slate-50 transition-all"
                            >
                                <option value="All">All Status</option>
                                <option value="Processing">Processing</option>
                                <option value="Delivered">Verified</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {filteredOrders.length > 0 ? (
                            <AnimatePresence>
                                {filteredOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group/order hover:shadow-xl hover:border-brand-primary/10 transition-all"
                                    >
                                        <div className="px-5 md:px-7 py-4 bg-slate-900 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-white">
                                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                                                <div>
                                                    <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Deployment</p>
                                                    <p className="text-[10px] md:text-xs font-bold">{order.date}</p>
                                                </div>
                                                <div className="min-w-0 flex-1 sm:flex-none">
                                                    <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Protocol ID</p>
                                                    <p className="text-[10px] md:text-xs font-bold text-brand-accent truncate max-w-[120px] sm:max-w-none">{order.id}</p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-fit px-3 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border",
                                                order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'verified'
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                    : order.status?.toLowerCase() === 'cancelled'
                                                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                                        : 'bg-brand-primary/20 text-brand-primary border-brand-primary/30'
                                            )}>
                                                {order.status?.toLowerCase() === 'delivered' ? 'Verified' : order.status?.toLowerCase() === 'cancelled' ? 'Cancelled' : order.status || 'Processing'}
                                            </div>
                                        </div>

                                        <div className="p-5 md:p-7">
                                            {order.items?.map((item: any) => (
                                                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 last:mb-0 pb-6 last:pb-0 border-b last:border-0 border-slate-50">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-xl overflow-hidden p-2 flex-shrink-0 border border-slate-100">
                                                            {item.image ? (
                                                                <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <div className="w-full h-full bg-slate-100" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-[13px] md:text-sm font-bold text-slate-800 mb-0.5 md:mb-1 truncate">{item.name}</h3>
                                                            <p className="text-[10px] md:text-[11px] font-semibold text-slate-400">Qty: {item.quantity} • Unit: ₹{item.price.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex sm:block justify-between items-center sm:text-right pt-2 sm:pt-0">
                                                        <p className="sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Price</p>
                                                        <p className="text-sm md:text-base font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap gap-3">
                                                <button
                                                    onClick={() => handleAction(`invoice-${order.id}`, 'invoice')}
                                                    className="px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white hover:border-brand-primary transition-all shadow-sm"
                                                >
                                                    {loadingStates[`invoice-${order.id}`] ? 'Wait...' : 'Invoice'}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(`track-${order.id}`, 'track')}
                                                    className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/10"
                                                >
                                                    {loadingStates[`track-${order.id}`] ? 'Syncing...' : 'Track Transit'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <ShoppingBag size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No Procurement History</h3>
                                <p className="text-sm text-slate-400 max-w-xs mx-auto mb-8 font-medium">Your clinical pipeline is empty. Explore our inventory to start your first order.</p>
                                <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">
                                    Browse Shop <ArrowRight size={14} />
                                </Link>
                            </div>
                        )}
                    </div>

                    <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <div className="bg-brand-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-brand-dark/20">
                            <div className="relative z-10 space-y-6">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-2">
                                    <ShieldCheck size={24} className="text-brand-accent" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold tracking-tight mb-2">Clinical Support</h3>
                                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Direct line to equipment specialist hubs.</p>
                                </div>
                                <Link href="/contact" className="block mt-6">
                                    <button className="w-full py-3.5 bg-brand-accent text-brand-dark rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg">
                                        Open Consultation Hub
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partner Perks</h4>
                                <Sparkles size={16} className="text-brand-primary" />
                            </div>
                            <div className="space-y-6">
                                {[
                                    { title: "GST Reports", desc: "Auto-sync invoicing", icon: <CreditCard size={18} />, color: "text-brand-primary" },
                                    { title: "Rapid Transit", desc: "Verified handling", icon: <Truck size={18} />, color: "text-emerald-500" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                            <div className={item.color}>{item.icon}</div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm mb-0.5">{item.title}</p>
                                            <p className="text-[10px] font-medium text-slate-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div></div>}>
            <OrdersPageContent />
        </Suspense>
    );
}
