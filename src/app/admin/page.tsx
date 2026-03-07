"use client";

import { Users, DollarSign, Package, ShoppingCart, Download, ClipboardList, RefreshCw, Loader2 } from "lucide-react";
import { getOrders } from "@/actions/admin-orders";
import { getProducts } from "@/actions/product-actions";
import { getUsersCount } from "@/actions/admin-users";
import SalesVelocityChart from "@/components/admin/SalesVelocityChart";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [data, setData] = useState<{ orders: any[], products: any[], usersCount: number }>({
        orders: [],
        products: [],
        usersCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [protocolRunning, setProtocolRunning] = useState<string | null>(null);
    const [lastSynced, setLastSynced] = useState<string>('');

    const fetchData = useCallback(async (isMounted = true) => {
        try {
            const [o, p, u] = await Promise.all([getOrders(), getProducts(), getUsersCount()]);
            if (isMounted) {
                setData({
                    orders: o.success ? o.orders : [],
                    products: p.success ? p.products : [],
                    usersCount: u.success ? u.count : 0
                });
                setLastSynced(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                setLoading(false);
            }
        } catch (err) {
            if (isMounted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        fetchData(isMounted);
        return () => { isMounted = false; };
    }, [fetchData]);

    const handleExportLedger = async () => {
        setProtocolRunning('export');
        await new Promise(r => setTimeout(r, 600));
        try {
            const headers = "Order ID,Date,Customer,Items,Total Amount,Payment,Status\n";
            const rows = data.orders.map((o: any) => {
                const itemNames = (o.items || []).map((i: any) => i.name).join(' | ');
                return `${o.id},${o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : o.date || ''},${o.customer?.name || ''},"${itemNames}",${o.totalAmount || 0},${o.paymentMethod || 'N/A'},${o.status || 'Processing'}`;
            }).join('\n');
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Blueteeth_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(`Core Ledger exported — ${data.orders.length} orders`);
        } catch {
            toast.error('Export failed');
        }
        setProtocolRunning(null);
    };

    const handleInventoryAudit = async () => {
        setProtocolRunning('audit');
        await new Promise(r => setTimeout(r, 800));
        try {
            const headers = "Product ID,Name,Category,Price (₹),Stock Status\n";
            const rows = data.products.map((p: any) =>
                `${p.id},"${p.name}",${p.category || 'N/A'},${p.price || 0},${p.inStock !== false ? 'In Stock' : 'Out of Stock'}`
            ).join('\n');
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Blueteeth_Inventory_Audit_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(`Inventory Audit complete — ${data.products.length} products`);
        } catch {
            toast.error('Audit failed');
        }
        setProtocolRunning(null);
    };

    const handleSyncDatabase = async () => {
        setSyncing(true);
        setProtocolRunning('sync');
        const t = toast.loading('Syncing database...');
        await fetchData();
        toast.success('Database synced successfully', { id: t });
        setSyncing(false);
        setProtocolRunning(null);
    };

    const totalRevenue = data.orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">Dashboard Analytics</h1>
                    <p className="text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest opacity-60 italic">Real-time platform metrics and transactional activity.</p>
                </div>
            </div>

            {/* Metrics Grid with Colors and Full Labels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox
                    title="Revenue"
                    value={`₹${(totalRevenue / 100000).toFixed(2)}L`}
                    icon={<DollarSign size={20} />}
                    color="blue"
                />
                <StatBox
                    title="Active Orders"
                    value={data.orders.length}
                    icon={<ShoppingCart size={20} />}
                    color="emerald"
                />
                <StatBox
                    title="User Index"
                    value={data.usersCount}
                    icon={<Users size={20} />}
                    color="amber"
                />
                <StatBox
                    title="Asset Stock"
                    value={data.products.length}
                    icon={<Package size={20} />}
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Activity - Simple Clean Card */}
                <div className="lg:col-span-2 bg-blue-50/20 backdrop-blur-md p-8 rounded-2xl border border-blue-200/50 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-8 pb-5 border-b border-blue-200/30">
                        <div className="flex flex-col">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">Sales Velocity (12D)</h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Revenue Flow Analysis</p>
                        </div>
                        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-blue-100/50 rounded-full border border-blue-200/50 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <span className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Live Trend</span>
                        </div>
                    </div>
                    <div className="h-72 pt-4">
                        <SalesVelocityChart orders={data.orders} />
                    </div>
                </div>

                {/* Management Column */}
                <div className="bg-blue-100/40 backdrop-blur-md p-8 rounded-2xl border-2 border-blue-200/60 shadow-sm flex flex-col gap-6 transition-all">
                    <div className="flex flex-col">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-800 mb-1">Management Core</h2>
                        <p className="text-[9px] font-bold text-blue-600/60 uppercase tracking-widest italic">Institutional Protocols</p>
                    </div>
                    <div className="space-y-2.5">
                        <ProtocolItem
                            label="Export Core Ledger"
                            icon={<Download size={14} />}
                            running={protocolRunning === 'export'}
                            onClick={handleExportLedger}
                        />
                        <ProtocolItem
                            label="Inventory Audit"
                            icon={<ClipboardList size={14} />}
                            running={protocolRunning === 'audit'}
                            onClick={handleInventoryAudit}
                        />
                        <ProtocolItem
                            label="Sync Database"
                            icon={syncing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            running={protocolRunning === 'sync'}
                            onClick={handleSyncDatabase}
                        />
                    </div>
                    <div className="mt-auto pt-5 border-t border-blue-200/40">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[9px] text-blue-800 font-black uppercase tracking-widest italic opacity-70">
                                {lastSynced ? `Last Synced: ${lastSynced}` : 'System Status: Nominal'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
    const colorMap: Record<string, string> = {
        blue: "text-blue-600 bg-blue-100 border-blue-200",
        emerald: "text-emerald-600 bg-emerald-100 border-emerald-200",
        amber: "text-amber-600 bg-amber-100 border-amber-200",
        rose: "text-rose-600 bg-rose-100 border-rose-200",
    };

    const bgMap: Record<string, string> = {
        blue: "bg-blue-50/80 border-blue-200/50 hover:bg-blue-100/50 hover:border-blue-300/50",
        emerald: "bg-emerald-50/80 border-emerald-200/50 hover:bg-emerald-100/50 hover:border-emerald-300/50",
        amber: "bg-amber-50/80 border-amber-200/50 hover:bg-amber-100/50 hover:border-amber-300/50",
        rose: "bg-rose-50/80 border-rose-200/50 hover:bg-rose-100/50 hover:border-rose-300/50",
    };

    return (
        <div className={`p-6 rounded-2xl border shadow-sm flex items-center gap-5 transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden backdrop-blur-sm cursor-default ${bgMap[color]}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-md transition-all ${colorMap[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1 opacity-70 italic">{title}</p>
                <p className="text-2xl font-black text-slate-900 leading-none tabular-nums tracking-tighter">{value}</p>
            </div>
        </div>
    );
}

function ProtocolItem({ label, icon, running, onClick }: { label: string; icon?: React.ReactNode; running?: boolean; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            disabled={running}
            className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-blue-700/80 rounded-2xl transition-all border border-blue-200/50 flex items-center justify-between group bg-blue-50/60 hover:bg-white hover:shadow-lg hover:border-blue-400/30 hover:text-blue-900 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                {running ? <Loader2 size={13} className="animate-spin" /> : icon}
                {running ? 'Running...' : label}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full transition-all shadow-[0_0_8px_rgba(37,99,235,0.2)] ${running ? 'bg-amber-400 animate-pulse' : 'bg-blue-400 group-hover:bg-blue-600'}`} />
        </button>
    );
}
