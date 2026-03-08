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
        <div className="bg-[#f8faff] min-h-screen py-8 md:py-12 text-slate-900 relative overflow-x-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/[0.03] rounded-full blur-[150px] -mr-64 -mt-64" />

            <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-12 relative z-10">
                {/* Compact Header Breadcrumb - Merged on Mobile */}
                <div className="hidden md:flex items-center gap-4 mb-8">
                    <BackButton />
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={18} className="text-brand-primary" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Ecosystem</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:items-start">
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
                            className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/40 flex flex-col md:flex-row justify-between items-center gap-5 md:gap-6"
                        >
                            <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
                                {/* Integrated Back Button for Mobile */}
                                <div className="md:hidden">
                                    <BackButton className="w-10 h-10 rounded-xl" />
                                </div>

                                <div className="p-3 md:p-4 bg-brand-primary rounded-2xl md:rounded-[1.5rem] text-white shadow-lg shadow-brand-primary/30 shrink-0">
                                    <ListFilter className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                        <h1 className="text-base md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                            {query ? `Search: "${query}"` : "Dental Portfolio"}
                                        </h1>
                                        <div className="bg-brand-primary/10 text-brand-primary text-[8px] md:text-[10px] font-black px-2 md:px-2.5 py-1 rounded-full uppercase tracking-widest border border-brand-primary/10 w-fit shrink-0">
                                            {filteredProducts.length} Items
                                        </div>
                                    </div>
                                    <p className="text-[8px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Found in active repository</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                                <div className="relative flex-1 md:w-64">
                                    <select
                                        className="w-full appearance-none bg-brand-primary/5 border border-brand-primary/10 text-center sm:text-left px-5 md:px-6 py-3 md:py-4 pr-8 sm:pr-10 md:pr-12 rounded-xl md:rounded-2xl text-[12px] md:text-sm font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer text-brand-primary"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="recommended">Best Match</option>
                                        <option value="price-low">Lowest Cost</option>
                                        <option value="price-high">Highest Premium</option>
                                        <option value="rating">Top Performance</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-brand-primary w-4 h-4 pointer-events-none" />
                                </div>
                                <button
                                    className="lg:hidden p-3 md:p-4 bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
                                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                                >
                                    <Filter size={18} className="text-brand-primary" />
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
                                    className="lg:hidden overflow-hidden w-full"
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
                            <div className="bg-white rounded-3xl md:rounded-[3rem] p-8 md:p-32 text-center border-2 border-dashed border-brand-primary/20 space-y-4 md:space-y-6">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto text-brand-primary/40">
                                    <PackageX className="w-8 h-8 md:w-12 md:h-12" />
                                </div>
                                <div className="space-y-1 md:space-y-2">
                                    <h3 className="text-xl md:text-2xl font-black text-brand-dark tracking-tight">Inventory Mismatch</h3>
                                    <p className="text-[12px] md:text-base text-slate-500 font-medium max-w-[250px] md:max-w-sm mx-auto leading-relaxed">
                                        No components match your settings. Try recalibrating your filters or search query.
                                    </p>
                                </div>
                                <button onClick={clearFilters} className="bg-brand-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-brand-dark shadow-lg shadow-brand-primary/20 transition-all">Reset Matrix</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
