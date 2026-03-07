import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, Crown, Calendar, Images } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) redirect("/login");
    if ((session.user as any).role !== "ADMIN") redirect("/");

    return (
        <div className="flex min-h-screen bg-slate-50/50 text-slate-700 font-sans tracking-tight">
            {/* Expanded Sidebar with Names and Colors */}
            <aside className="w-68 bg-white border-r border-slate-200 sticky top-0 h-screen flex flex-col shadow-sm z-20">
                <div className="p-8 flex-1 overflow-y-auto">
                    <Link href="/" className="flex items-center gap-4 mb-12 px-1 group">
                        <div className="w-11 h-11 bg-slate-900 rounded-[1rem] flex items-center justify-center text-white font-bold text-sm shadow-xl group-hover:scale-110 transition-transform ring-4 ring-slate-100">
                            BT
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-tight">Blueteeth</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Control Panel</span>
                        </div>
                    </Link>

                    <nav className="space-y-1.5">
                        <div className="px-3 mb-5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic opacity-60">Operations</span>
                        </div>
                        <SidebarLink href="/admin" icon={<LayoutDashboard size={18} />} label="Analytics" color="blue" />
                        <SidebarLink href="/admin/orders" icon={<ShoppingBag size={18} />} label="Order Flow" color="emerald" />
                        <SidebarLink href="/admin/products" icon={<Package size={18} />} label="Repository" color="purple" />

                        <div className="px-3 mt-10 mb-5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic opacity-60">Management</span>
                        </div>
                        <SidebarLink href="/admin/users" icon={<Users size={18} />} label="Identities" color="indigo" />
                        <SidebarLink href="/admin/membership" icon={<Crown size={18} />} label="Clinical Tiers" color="amber" />
                        <SidebarLink href="/admin/events" icon={<Calendar size={18} />} label="Academy Events" color="rose" />
                        <SidebarLink href="/admin/gallery" icon={<Images size={18} />} label="Media Vault" color="teal" />
                        <SidebarLink href="/admin/settings" icon={<Settings size={18} />} label="System Config" color="slate" />
                    </nav>
                </div>

                <div className="p-8 border-t border-slate-100 mt-auto">
                    <form action={async () => {
                        "use server";
                        const { signOut } = await import("@/auth");
                        await signOut({ redirectTo: "/" });
                    }}>
                        <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.15em] border border-rose-500/10 hover:border-rose-500/30 group shadow-sm">
                            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Terminate Session
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-slate-50/30 backdrop-blur-3xl overflow-y-auto">
                <div className="p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
    const colorStyles: Record<string, string> = {
        blue: "text-blue-600 bg-blue-100/50 border-blue-200/50",
        emerald: "text-emerald-600 bg-emerald-100/50 border-emerald-200/50",
        purple: "text-purple-600 bg-purple-100/50 border-purple-200/50",
        indigo: "text-indigo-600 bg-indigo-100/50 border-indigo-200/50",
        amber: "text-amber-600 bg-amber-100/50 border-amber-200/50",
        slate: "text-slate-600 bg-slate-100/50 border-slate-200/50",
        rose: "text-rose-600 bg-rose-100/50 border-rose-200/50",
    };

    return (
        <Link
            href={href}
            className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 rounded-2xl transition-all group hover:bg-white hover:shadow-md border border-transparent hover:border-white/20"
        >
            <div className={`w-10 h-10 rounded-[0.8rem] flex items-center justify-center border transition-all shadow-sm ${colorStyles[color]} group-hover:scale-110`}>
                {icon}
            </div>
            <span className="text-[13px] font-bold tracking-tight transition-transform group-hover:translate-x-1 uppercase tracking-widest text-[10px]">{label}</span>
        </Link>
    );
}
