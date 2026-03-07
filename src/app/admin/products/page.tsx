import { getProducts } from "@/actions/product-actions";
import ProductListClient from "@/components/admin/ProductListClient";

export default async function AdminProductsPage() {
    const { products = [] } = await getProducts();

    return (
        <div className="p-8 max-w-[1700px] mx-auto text-black min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Inventory Control</h1>
                    <p className="text-slate-500 mt-1 font-medium">Global management of clinical assets and commercial pricing.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Inventory" value={products.length} color="blue" subtitle="Active Assets" />
                <StatCard label="Priority Assets" value={products.filter((p: any) => p.isFeatured).length} color="purple" subtitle="Featured" />
                <StatCard label="Stock Alerts" value={products.filter((p: any) => p.stock === 0).length} color="red" subtitle="Critical" />
                <StatCard label="Supply Nodes" value={new Set(products.map((p: any) => p.category)).size} color="emerald" subtitle="Sectors" />
            </div>

            {/* Interactive Client View */}
            <ProductListClient initialProducts={products} />
        </div>
    );
}

function StatCard({ label, value, color, subtitle }: { label: string; value: string | number; color: 'blue' | 'purple' | 'red' | 'emerald'; subtitle: string }) {
    const colorMap = {
        blue: "text-blue-600 bg-blue-100 border-blue-200",
        purple: "text-purple-600 bg-purple-100 border-purple-200",
        red: "text-red-600 bg-red-100 border-red-200",
        emerald: "text-emerald-600 bg-emerald-100 border-emerald-200",
    };

    const bgMap = {
        blue: "bg-blue-50/80 border-blue-200/50 hover:bg-blue-100/50 hover:border-blue-300/50",
        purple: "bg-purple-50/80 border-purple-200/50 hover:bg-purple-100/50 hover:border-purple-300/50",
        red: "bg-red-50/80 border-red-200/50 hover:bg-red-100/50 hover:border-red-300/50",
        emerald: "bg-emerald-50/80 border-emerald-200/50 hover:bg-emerald-100/50 hover:border-emerald-300/50",
    };

    return (
        <div className={`p-6 rounded-2xl border shadow-sm transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden backdrop-blur-sm cursor-default ${bgMap[color]}`}>
            <div className="relative z-10">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.15em] mb-4 opacity-70 italic">{label}</p>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                        {value}
                    </span>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm transition-transform group-hover:scale-105 ${colorMap[color]}`}>
                        {subtitle}
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Glow */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-[0.05] blur-3xl transition-transform group-hover:scale-125 ${colorMap[color].split(' ')[1]}`} />
        </div>
    );
}
