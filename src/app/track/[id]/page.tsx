import { getOrderById } from "@/actions/order-actions";
import { BackButton } from "@/components/ui/BackButton";
import { Package, Truck, CheckCircle2, ClipboardList, MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import * as motion from "framer-motion/client";

export default async function TrackOrderPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const orderId = id;
    const order: any = await getOrderById(orderId);

    if (!order) {
        redirect("/orders");
    }

    const steps = [
        { title: "Order Placed", desc: "Protocol initiated", icon: ClipboardList },
        { title: "Processing", desc: "Undergoing quality checks", icon: Package },
        { title: "Dispatched", desc: "Handed over to logistics", icon: Truck },
        { title: "Delivered", desc: "Successfully received", icon: CheckCircle2 }
    ];

    // Determine current active step index (0 to 3) based on status or statusStep
    let activeStep = 0;
    if (order.statusStep !== undefined) {
        activeStep = order.statusStep; // 0=Placed, 1=Processing, 2=Dispatched, 3=Delivered
    } else {
        if (order.status === 'Processing') activeStep = 1;
        if (order.status === 'Dispatched') activeStep = 2;
        if (order.status === 'Delivered') activeStep = 3;
    }

    const trackingId = `BT-${orderId.split('-')[1] || orderId.substring(0, 5)}-IN`;

    return (
        <div className="bg-[#FAFBFF] min-h-screen pt-8 pb-32 relative overflow-hidden font-sans">
            {/* Light Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full -mr-48 -mt-48 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full -ml-48 -mb-48 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden mb-8 md:mb-12">
                    <div className="relative p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/[0.03] to-transparent pointer-events-none" />

                        <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
                            <BackButton className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl shrink-0" />
                            <div className="min-w-0">
                                <div className="flex flex-col-reverse md:flex-row md:items-center gap-1 md:gap-3 mb-1 md:mb-0">
                                    <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter truncate">Logistics <span className="text-brand-primary">Detail</span></h1>
                                    <div className="w-fit inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </span>
                                        Real-Time Tracking
                                    </div>
                                </div>
                                <p className="text-[10px] md:text-sm text-slate-400 font-medium leading-tight">
                                    Waybill No: <span className="text-slate-900 font-extrabold">{trackingId}</span>
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-3 relative z-10">
                            <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 flex items-center gap-2">
                                <Package size={14} className="text-brand-primary" />
                                {order.status || 'In Transit'}
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative overflow-hidden group"
                >
                    {/* Inner glowing card effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between w-full mx-auto pb-6 md:pb-10 pt-4">
                        {steps.map((step, idx) => {
                            const isCompleted = idx <= activeStep;
                            const isActive = idx === activeStep;

                            return (
                                <div key={idx} className="relative flex flex-row md:flex-col items-start md:items-center flex-1 mb-10 md:mb-0 last:mb-0">
                                    {/* Line connecting steps */}
                                    {idx !== steps.length - 1 && (
                                        <>
                                            {/* Vertical line for mobile */}
                                            <div className="md:hidden absolute left-[28px] top-[56px] w-[2px] h-[calc(100%-20px)] bg-slate-100 -z-10">
                                                {idx < activeStep && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: "100%" }}
                                                        transition={{ duration: 1, delay: idx * 0.2 }}
                                                        className="w-full bg-brand-primary shadow-[0_0_10px_rgba(0,100,255,0.3)]"
                                                    />
                                                )}
                                            </div>
                                            {/* Horizontal line for desktop */}
                                            <div className="hidden md:block absolute top-[28px] left-[50%] w-full h-[3px] bg-slate-100 rounded-full -z-10">
                                                {idx < activeStep && (
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 1, delay: idx * 0.2 }}
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary to-blue-400 rounded-full w-full shadow-[0_0_10px_rgba(0,100,255,0.3)]"
                                                    />
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: idx * 0.15 + 0.2, type: "spring" }}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center border-[3px] transition-all duration-700 relative z-10 shrink-0
                                        ${isCompleted && !isActive ? 'bg-brand-primary text-white border-brand-primary shadow-[0_8px_16px_rgba(0,100,255,0.25)]' : ''}
                                        ${isActive ? 'bg-white text-brand-primary border-brand-primary shadow-[0_0_0_6px_rgba(0,100,255,0.1)]' : ''}
                                        ${!isCompleted && !isActive ? 'bg-slate-50 text-slate-300 border-slate-200' : ''}`}
                                    >
                                        <step.icon size={20} className={isActive ? "animate-pulse" : ""} />
                                    </motion.div>

                                    <div className="ml-6 md:ml-0 md:text-center md:pt-5 w-full">
                                        <h4 className={`text-[13px] md:text-sm font-extrabold mb-1 tracking-tight transition-colors duration-500 ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</h4>
                                        <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-relaxed ${isActive ? 'text-brand-primary font-black' : 'text-slate-400'}`}>{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100/80 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/80 rounded-2xl border">
                        <div>
                            <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-1.5 flex items-center gap-1.5"><Truck size={12} /> Estimated Arrival</p>
                            <p className="text-lg md:text-xl font-black text-slate-900">{order.date} <span className="text-slate-500 text-[11px] uppercase font-bold tracking-widest ml-2 bg-white px-2 py-1 rounded-md border border-slate-200">+3 to +5 Days</span></p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <a href="https://www.bluedart.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-primary text-white px-6 md:px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.1em] md:tracking-[0.15em] text-[9px] md:text-[10px] hover:bg-brand-dark shadow-[0_10px_20px_rgba(0,100,255,0.2)] hover:shadow-[0_10px_25px_rgba(0,100,255,0.25)] transition-all duration-300 group whitespace-nowrap">
                                Open Logistics Portal
                                <span className="bg-white/20 p-1 rounded-md group-hover:bg-white/30 transition-colors shrink-0">
                                    <MapPin size={12} />
                                </span>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
