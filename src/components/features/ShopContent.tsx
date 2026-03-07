"use client";

import { useState, useMemo } from "react";
import { Filter, ChevronDown, PackageX, ShoppingBag, ListFilter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { ProductCard } from "@/components/features/ProductCard";
import { ShopFilters } from "@/components/features/ShopFilters";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";

export default function ShopContent({ dbProducts = [] }: { dbProducts?: any[] }) {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [sortBy, setSortBy] = useState("recommended");
    const [price, setPrice] = useState<number>(200000);
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

    const searchParams = useSearchParams();
    const query = searchParams?.get("query")?.toLowerCase() || "";

    const allProducts = useMemo(() => {
        const formattedDbProducts = dbProducts.map(p => ({
            ...p,
            id: p.id || p._id,
            image: p.image || (p.images && p.images[0]?.url) || "/images/placeholder.png"
        }));

        const dbProductIds = new Set(formattedDbProducts.map(p => p.id));
        const filteredStatic = PRODUCTS.filter(p => !dbProductIds.has(p.id));

        return [...formattedDbProducts, ...filteredStatic];
    }, [dbProducts]);

    const filteredProducts = useMemo(() => {
        let items = [...allProducts];

        if (query) {
            items = items.filter(
                (product) =>
                    (product.name || "").toLowerCase().includes(query) ||
                    (product.category || "").toLowerCase().includes(query) ||
                    (product.description || "").toLowerCase().includes(query)
            );
        }

        // Category & Sub-category Filter
        if (selectedCats.length > 0 || selectedSubs.length > 0) {
            items = items.filter((product) => {
                const catMatch = selectedCats.length === 0 || selectedCats.includes(product.category);
                const subMatch = selectedSubs.length === 0 || selectedSubs.includes(product.subCategory || product.category); // Fallback to category for sub-category

                // If both are selected, we want an 'OR' behavior within the sector usually, 
                // but if only sub is selected, we filter by sub.
                if (selectedSubs.length > 0) return subMatch;
                return catMatch;
            });
        }

        items = items.filter((product) => product.price <= price);

        return items.sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            return 0;
        });
    }, [query, sortBy, selectedCats, selectedSubs, price, allProducts]);

    const toggleCat = (catName: string) => {
        setSelectedCats(prev =>
            prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
        );
    };

    const toggleSub = (subName: string) => {
        setSelectedSubs(prev =>
            prev.includes(subName) ? prev.filter(s => s !== subName) : [...prev, subName]
        );
    };

    const clearFilters = () => {
        setPrice(200000);
        setSelectedCats([]);
        setSelectedSubs([]);
        setSortBy("recommended");
    };

    return (
        <div className="bg-[#f8faff] min-h-screen py-12 text-slate-900 relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/[0.03] rounded-full blur-[150px] -mr-64 -mt-64" />

            <div className="max-w-[1600px] w-full mx-auto px-8 sm:px-12 relative z-10">
                <div className="flex items-center gap-4 mb-10">
                    <BackButton />
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={18} className="text-brand-primary" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Ecosystem</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Filter Sidebar */}
                    <aside className="hidden lg:block w-[360px] flex-shrink-0 sticky top-32 h-fit">
                        <ShopFilters
                            price={price}
                            setPrice={setPrice}
                            selectedCats={selectedCats}
                            selectedSubs={selectedSubs}
                            toggleCat={toggleCat}
                            toggleSub={toggleSub}
                            clearFilters={clearFilters}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 w-full space-y-8">
                        {/* Control Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6"
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-brand-primary rounded-[1.5rem] text-white shadow-lg shadow-brand-primary/30">
                                    <ListFilter size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                            {query ? `Search: "${query}"` : "Dental Portfolio"}
                                        </h1>
                                        <div className="bg-brand-primary/10 text-brand-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-brand-primary/10">
                                            {filteredProducts.length} Items
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Found in active repository</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <select
                                        className="w-full appearance-none bg-brand-primary/5 border border-brand-primary/10 px-6 py-4 pr-12 rounded-2xl text-sm font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer text-brand-primary"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="recommended">Best Match</option>
                                        <option value="price-low">Lowest Cost</option>
                                        <option value="price-high">Highest Premium</option>
                                        <option value="rating">Top Performance</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-primary w-4 h-4" />
                                </div>
                                <button
                                    className="lg:hidden p-4 bg-white border border-slate-200 rounded-2xl shadow-sm"
                                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                                >
                                    <Filter size={20} className="text-brand-primary" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Mobile Filters */}
                        <AnimatePresence>
                            {isMobileFiltersOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="lg:hidden overflow-hidden"
                                >
                                    <ShopFilters
                                        price={price}
                                        setPrice={setPrice}
                                        selectedCats={selectedCats}
                                        selectedSubs={selectedSubs}
                                        toggleCat={toggleCat}
                                        toggleSub={toggleSub}
                                        clearFilters={clearFilters}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredProducts.map((product, idx) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (idx % 6) * 0.05, duration: 0.5 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-brand-primary/20 space-y-6">
                                <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto text-brand-primary/40">
                                    <PackageX size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-brand-dark tracking-tight">Inventory Mismatch</h3>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto">No components match your matrix settings. Try recalibrating your filters or search query.</p>
                                </div>
                                <button onClick={clearFilters} className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark shadow-lg shadow-brand-primary/20 transition-all">Reset Matrix</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
