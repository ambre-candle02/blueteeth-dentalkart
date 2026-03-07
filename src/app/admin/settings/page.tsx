import { getGlobalConfig } from "@/actions/admin-settings";
import AdminSettingsForm from "./AdminSettingsForm";

export default async function AdminSettingsPage() {
    const config = await getGlobalConfig();

    return (
        <div className="p-6 max-w-[1200px] mx-auto text-black mb-32">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-brand-primary/10">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-primary"></span>
                    </span>
                    Control Matrix // System v2
                </div>
                <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-2 uppercase">Platform Engine</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Global shop parameters and ecosystem throttling</p>
            </div>

            <AdminSettingsForm initialConfig={config} />
        </div>

    );
}

