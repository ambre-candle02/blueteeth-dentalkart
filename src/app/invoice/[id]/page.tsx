import { getOrderById } from "@/actions/order-actions";
import { redirect } from "next/navigation";
import { PrintButton } from "@/components/ui/PrintButton";

export default async function InvoicePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const orderId = id;
    const order: any = await getOrderById(orderId);

    if (!order) {
        redirect("/orders");
    }

    const {
        user: customer,
        items,
        totalAmount: total,
        createdAt: date,
        status,
        paymentStatus,
        shippingAddress
    } = order;

    return (
        <div className="bg-slate-100 min-h-screen p-4 sm:p-8 font-sans print:p-0 print:bg-white flex justify-center">

            <div className="bg-white max-w-4xl w-full shadow-2xl print:shadow-none p-10 sm:p-14 md:p-16 border border-slate-200">
                {/* Header section */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
                    <div>
                        <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center font-black text-white text-3xl tracking-tighter mb-4 shadow-xl shadow-brand-primary/20">B</div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">Blueteeth</h1>
                        <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Premium Dentalkart</p>
                    </div>
                    <div className="text-left md:text-right">
                        <h2 className="text-5xl font-black text-slate-200 uppercase tracking-tighter">Invoice</h2>
                        <div className="mt-4 flex flex-col md:items-end gap-1">
                            <p className="text-sm font-bold text-slate-900"><span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mr-3">Date</span> {new Date(date).toLocaleDateString()}</p>
                            <p className="text-sm font-bold text-slate-900"><span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mr-3">Invoice No</span> {orderId}</p>
                            <p className="text-sm font-bold text-emerald-600"><span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mr-3">Status</span> {paymentStatus || "Paid"}</p>
                        </div>
                    </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-b border-slate-100 py-10 mb-12">
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-brand-primary uppercase mb-3">Billed To</p>
                        <h3 className="text-lg font-black text-slate-900 mb-1">{customer?.name || shippingAddress?.fullName || "Premium Healthcare Partner"}</h3>
                        <p className="text-sm font-medium text-slate-500 mb-1">{shippingAddress?.address || "Address not provided"}</p>
                        <p className="text-sm font-medium text-slate-500 mb-1">{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.pinCode}</p>
                        <p className="text-sm font-medium text-slate-500">{customer?.mobile || shippingAddress?.phone}</p>
                    </div>

                    <div className="md:text-right">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-3">Issued By</p>
                        <h3 className="text-lg font-black text-slate-900 mb-1">Blueteeth Corp.</h3>
                        <p className="text-sm font-medium text-slate-500 mb-1">Chirag Delhi Metro Stn, Masjid Moth</p>
                        <p className="text-sm font-medium text-slate-500 mb-1">New Delhi, ND-110017, India</p>
                        <p className="text-sm font-medium text-brand-primary">finance@blueteeth.store</p>
                    </div>
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto mb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="pb-3 pt-2">Description</th>
                                <th className="pb-3 pt-2 text-center w-24">Qty</th>
                                <th className="pb-3 pt-2 text-right w-32">Unit Price</th>
                                <th className="pb-3 pt-2 text-right w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm border-b-2 border-slate-100">
                            {items.map((item: any, i: number) => (
                                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 pr-4">
                                        <p className="font-bold text-slate-900 mb-1">{item.name}</p>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.category || "Clinical Supply"}</p>
                                    </td>
                                    <td className="py-5 text-center font-bold text-slate-700">{item.quantity}</td>
                                    <td className="py-5 text-right font-medium text-slate-500">₹{item.price.toLocaleString()}</td>
                                    <td className="py-5 text-right font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Totals */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                    <div className="w-full md:w-1/2">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-3">Payment Info</p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <p className="text-xs font-medium text-slate-600 mb-1"><strong>Method:</strong> Secure Online Portal / UPI</p>
                            <p className="text-xs font-medium text-slate-600 mb-1"><strong>Transaction ID:</strong> TXN-{orderId.split('-')[1] || "102934"}</p>
                            <p className="text-xs font-medium text-slate-600"><strong>GSTIN:</strong> 07AAACB1234C1Z5 (Blueteeth)</p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 md:max-w-xs space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-500">Subtotal</span>
                            <span className="font-black text-slate-900">₹{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-500">Tax (IGST/CGST 18%)</span>
                            <span className="font-black text-slate-900">Inclusive</span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-slate-100 pb-3">
                            <span className="font-bold text-slate-500">Shipping</span>
                            <span className="font-black text-emerald-600 uppercase text-[10px] tracking-widest">Free</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2">
                            <span className="text-lg font-black text-slate-900">Total</span>
                            <span className="text-3xl font-black text-brand-primary tracking-tighter">₹{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-500 mb-1">Thank you for your business. For any clinical queries, please contact our support.</p>
                    <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase">System Generated Document - Auth: {new Date().getTime().toString(16)}</p>
                </div>
            </div>

            {/* Print Button (Hidden in Print Mode) */}
            <div className="fixed bottom-10 right-10 print:hidden z-50 flex gap-4">
                <a href="/orders" className="bg-white text-slate-900 px-6 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center">
                    Back
                </a>
                <PrintButton />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; size: auto; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}} />
        </div>
    );
}
