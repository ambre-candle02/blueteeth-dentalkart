import PolicyLayout from "@/components/layout/PolicyLayout";

export default function CareersPage() {
    return (
        <PolicyLayout title="Careers">
            <p>Join the revolution in dental procurement. We are always looking for passionate individuals to join our team.</p>
            <h2 className="text-xl font-bold text-slate-800">Current Openings</h2>
            <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-900">Medical Sales Expert</h3>
                    <p className="text-sm">Location: Mumbai / Delhi</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-900">Full Stack Developer</h3>
                    <p className="text-sm">Location: Remote / Bangalore</p>
                </div>
            </div>
            <p className="mt-8">Send your CV to <span className="text-brand-primary font-bold">careers@blueteeth.store</span></p>
        </PolicyLayout>
    );
}
