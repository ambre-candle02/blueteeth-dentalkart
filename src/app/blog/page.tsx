import PolicyLayout from "@/components/layout/PolicyLayout";

export default function BlogPage() {
    return (
        <PolicyLayout title="Dental Blog">
            <p>Stay informed with the latest trends and research in clinical dentistry.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="space-y-4">
                    <div className="aspect-video bg-slate-200 rounded-2xl"></div>
                    <h3 className="text-xl font-bold text-slate-900">Modern Ergonomics in Dental Chairs</h3>
                    <p className="text-sm">Learn how the latest chair designs reduce practitioner fatigue and improve patient comfort.</p>
                </div>
                <div className="space-y-4">
                    <div className="aspect-video bg-slate-200 rounded-2xl"></div>
                    <h3 className="text-xl font-bold text-slate-900">Digital X-Rays: Time to Switch?</h3>
                    <p className="text-sm">A comprehensive guide on transitioning from analog to digital sensors for your practice.</p>
                </div>
            </div>
        </PolicyLayout>
    );
}
