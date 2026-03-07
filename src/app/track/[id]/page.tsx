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
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    {/* Custom dark theme back button wrapper since default back button might be light themed, but we rely on its own transparent styling */}
                    <div className="bg-white/5 inline-block rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm">
                        <BackButton />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Real-Time Tracking
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Logistics Detail</h1>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">
                        Waybill No: <span className="text-slate-900 font-extrabold bg-slate-100 px-2 py-1 rounded-md ml-1 border border-slate-200">{trackingId}</span>
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative overflow-hidden group"
                >
                    {/* Inner glowing card effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between w-full mx-auto pb-10 pt-4">
                        {steps.map((step, idx) => {
                            const isCompleted = idx <= activeStep;
                            const isActive = idx === activeStep;

                            return (
                                <div key={idx} className="relative flex flex-col items-center flex-1 mb-10 md:mb-0">
                                    {/* Line connecting steps */}
                                    {idx !== steps.length - 1 && (
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
                                    )}

                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: idx * 0.15 + 0.2, type: "spring" }}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center border-[3px] mb-5 transition-all duration-700 relative z-10 
                                        ${isCompleted && !isActive ? 'bg-brand-primary text-white border-brand-primary shadow-[0_8px_16px_rgba(0,100,255,0.25)]' : ''}
                                        ${isActive ? 'bg-white text-brand-primary border-brand-primary shadow-[0_0_0_6px_rgba(0,100,255,0.1)]' : ''}
                                        ${!isCompleted && !isActive ? 'bg-slate-50 text-slate-300 border-slate-200' : ''}`}
                                    >
                                        <step.icon size={20} className={isActive ? "animate-pulse" : ""} />
                                    </motion.div>

                                    <div className="text-center px-1 bg-white relative z-10 w-full">
                                        <h4 className={`text-sm font-black mb-1.5 tracking-tight transition-colors duration-500 ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</h4>
                                        <p className={`text-[9.px] md:text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-brand-primary' : 'text-slate-400'}`}>{step.desc}</p>
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
                            <a href="https://www.bluedart.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-brand-primary shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_25px_rgba(0,100,255,0.25)] transition-all duration-300 group">
                                Open Logistics Portal
                                <span className="bg-white/20 p-1 rounded-md group-hover:bg-white/30 transition-colors">
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
