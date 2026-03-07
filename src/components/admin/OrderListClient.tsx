"use client";

import { useState } from "react";
import { Package, Truck, Clock, CheckCircle2, ChevronRight, MapPin, Search, Trash2, ShieldAlert } from "lucide-react";
import { updateOrderStatus, deleteOrder } from "@/actions/admin-orders";
import toast from "react-hot-toast";

export default function OrderListClient({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deletingIds, setDeletingIds] = useState<string[]>([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const toastId = toast.loading("Updating status...");
        try {
            const res = await updateOrderStatus(orderId, newStatus);
            if (res.success) {
                setOrders(orders.map(o => (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o));
                toast.success("Status Synchronized", { id: toastId });
            } else {
                toast.error(res.error || "Update Failed", { id: toastId });
            }
        } catch (error) {
            toast.error("Process Aborted", { id: toastId });
        }
    };

    const handleDelete = async (orderId: string) => {
        if (!orderId) return;
        setDeletingIds(prev => [...prev, orderId]);
        const toastId = toast.loading("Purging transaction...");
        try {
            const res = await deleteOrder(orderId);
            if (res.success) {
                setOrders(prev => prev.filter(o => o._id !== orderId && o.id !== orderId));
                setConfirmDeleteId(null);
                toast.success("Transaction purged from ledger", { id: toastId });
            } else {
                toast.error(res.error || "Purge failed", { id: toastId });
            }
        } catch (error) {
            toast.error("Network error", { id: toastId });
        } finally {
            setDeletingIds(prev => prev.filter(id => id !== orderId));
        }
    };

    const filteredOrders = orders.filter(order => {
        const orderId = order._id || order.id || "";
        const customer = order.customer || {};
        const matchesSearch =
            orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (customer.name || customer.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (customer.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (customer.mobile || customer.phone || "").includes(searchQuery);

        const matchesFilter = statusFilter === "all" || order.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesFilter;
    });


    const getStatusColor = (status: string) => {
        const colors: any = {
            pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
            processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
            delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
            cancelled: "bg-red-500/10 text-red-600 border-red-500/20"
        };
        return colors[status?.toLowerCase()] || "bg-slate-100 text-slate-800 border-slate-200";
    };

    return (
        <div className="space-y-6">

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <OrderStatCard label="Pending" count={orders.filter(o => o.status?.toLowerCase() === 'pending').length} icon={<Clock size={18} className="text-amber-500" strokeWidth={3} />} color="amber" onClick={() => setStatusFilter('pending')} active={statusFilter === 'pending'} />
                <OrderStatCard label="Processing" count={orders.filter(o => o.status?.toLowerCase() === 'processing').length} icon={<Package size={18} className="text-blue-500" strokeWidth={3} />} color="blue" onClick={() => setStatusFilter('processing')} active={statusFilter === 'processing'} />
                <OrderStatCard label="Shipped" count={orders.filter(o => o.status?.toLowerCase() === 'shipped').length} icon={<Truck size={18} className="text-indigo-500" strokeWidth={3} />} color="indigo" onClick={() => setStatusFilter('shipped')} active={statusFilter === 'shipped'} />
                <OrderStatCard label="Delivered" count={orders.filter(o => o.status?.toLowerCase() === 'delivered').length} icon={<CheckCircle2 size={18} className="text-emerald-500" strokeWidth={3} />} color="emerald" onClick={() => setStatusFilter('delivered')} active={statusFilter === 'delivered'} />
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-blue-50/20 backdrop-blur-md p-8 rounded-2xl border border-blue-200/50 shadow-sm">
                <div className="relative w-full sm:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500/50 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan Order ID or Trace Identity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 placeholder:text-slate-400 shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${statusFilter === 'all' ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30' : 'bg-white/60 text-slate-500 hover:text-blue-600 hover:bg-white border-blue-200/50 shadow-sm'}`}
                    >
                        Master Ledger
                    </button>
                    {statusFilter !== 'all' && (
                        <button
                            onClick={() => setStatusFilter('all')}
                            className="p-4 bg-white/60 text-slate-400 hover:text-rose-500 hover:bg-white border border-blue-200/50 rounded-2xl shadow-sm transition-all"
                        >
                            <ShieldAlert size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-blue-200/40 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-50/50 border-b border-blue-100/50">
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Transaction Trace</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Bio/Location</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Inventory</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Flow Value</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Status Matrix</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100/30">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-32 lg:py-40 text-center">
                                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                            <div className="w-20 h-20 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-200/50 shadow-inner group">
                                                <Package size={36} className="transition-transform" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase tracking-widest text-sm">Order Void</h3>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] opacity-70">
                                                No matches identified in current matrix slice.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order: any) => (
                                    <tr key={order._id || order.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="font-black text-slate-900 text-xs tabular-nums tracking-tighter">#{(order._id || order.id || "").substring(Math.max(0, (order._id || order.id || "").length - 8)).toUpperCase()}</span>
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1.5 opacity-60">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown Date'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-slate-800 text-xs tracking-tight">{(order.customer?.name || order.customer?.fullName) || 'No Name'}</span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                    {(order.customer?.city || order.customer?.address) ? `${order.customer?.city || ''} ${order.customer?.state || ''}`.trim() : 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex -space-x-3">
                                                {(order.items || []).slice(0, 3).map((item: any, idx: number) => (
                                                    <div key={idx} className="w-10 h-10 rounded-xl bg-white border-2 border-white shadow-md overflow-hidden ring-1 ring-blue-50 group-hover:scale-110 transition-transform cursor-pointer relative z-[10-idx]" title={item.product?.name || item.name}>
                                                        <img src={(item.product?.images?.[0]?.url || item.image) || '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                ))}
                                                {(order.items?.length || 0) > 3 && (
                                                    <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white flex items-center justify-center text-[10px] font-black text-blue-600 ring-1 ring-blue-50 shadow-md">
                                                        +{(order.items?.length || 0) - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-emerald-600 text-[13px] tabular-nums tracking-tighter">
                                                ₹{(order.totalAmount || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={order.status?.toLowerCase() || ''}
                                                onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                                                className={`text-[9px] font-black uppercase tracking-widest border px-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232563eb%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-[right_12px_center] bg-no-repeat transition-all shadow-sm ${getStatusColor(order.status)}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {confirmDeleteId === (order._id || order.id) ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleDelete(order._id || order.id)}
                                                            disabled={deletingIds.includes(order._id || order.id)}
                                                            className="text-[9px] font-black bg-rose-600 text-white px-4 py-2.5 rounded-xl hover:bg-rose-700 transition-all uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-rose-500/20"
                                                        >
                                                            {deletingIds.includes(order._id || order.id) ? "Purging..." : "Confirm"}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="text-[9px] font-black text-slate-500 hover:text-slate-800 px-3 py-2.5 uppercase tracking-widest transition-colors bg-slate-100 rounded-xl"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button className="text-[9px] font-black text-blue-600 hover:text-white transition-all uppercase tracking-widest bg-blue-50 hover:bg-blue-600 px-5 py-2.5 rounded-xl border border-blue-100 shadow-sm">
                                                            Audit
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeleteId(order._id || order.id)}
                                                            className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                                                            title="Purge Transaction"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function OrderStatCard({ label, count, icon, color, onClick, active }: { label: string; count: number; icon: React.ReactNode; color: 'amber' | 'blue' | 'indigo' | 'emerald'; onClick: () => void; active: boolean }) {
    const colorMap = {
        amber: "text-amber-600 bg-amber-100 border-amber-200",
        blue: "text-blue-600 bg-blue-100 border-blue-200",
        indigo: "text-indigo-600 bg-indigo-100 border-indigo-200",
        emerald: "text-emerald-600 bg-emerald-100 border-emerald-200",
    };

    const bgMap = {
        amber: "bg-amber-50/80 border-amber-200/50 hover:bg-amber-100/50 hover:border-amber-300/50",
        blue: "bg-blue-50/80 border-blue-200/50 hover:bg-blue-100/50 hover:border-blue-300/50",
        indigo: "bg-indigo-50/80 border-indigo-200/50 hover:bg-indigo-100/50 hover:border-indigo-300/50",
        emerald: "bg-emerald-50/80 border-emerald-200/50 hover:bg-emerald-100/50 hover:border-emerald-300/50",
    };

    return (
        <div
            onClick={onClick}
            className={`p-6 rounded-2xl border shadow-sm flex items-center gap-5 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden ${active ? 'bg-white shadow-xl border-blue-500/30 ring-4 ring-blue-500/5' : `${bgMap[color]} shadow-sm`}`}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-md transition-all ${colorMap[color]}`}>
                {icon}
            </div>
            <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${active ? 'text-slate-500' : 'text-slate-500/70'}`}>{label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">{count}</p>
            </div>
            {active && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[8px] font-black text-white uppercase tracking-tighter">Selected</span>
                </div>
            )}
        </div>
    );
}


