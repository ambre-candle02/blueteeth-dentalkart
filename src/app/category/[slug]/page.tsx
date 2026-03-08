import { CATEGORIES, PRODUCTS } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Filter, ChevronDown, Sparkles, LayoutGrid } from "lucide-react";
import { CategoryProductGrid } from "@/components/features/CategoryProductGrid";
import { BackButton } from "@/components/ui/BackButton";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ sub?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params;
    const { sub: subParam } = await searchParams;

    let categoryName = "";
    let parentCategory = "";
    let isMainCategory = false;

    // Robust matching for main category first
    let mainCat = CATEGORIES.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === slug);

    // Explicit Fallbacks for common legacy/hardcoded slugs
    if (!mainCat) {
        if (slug === 'dental-chairs' || slug === 'x-ray-sensors') {
            mainCat = CATEGORIES.find(c => c.name === 'Equipment');
        }
    }

    if (mainCat) {
        categoryName = mainCat.name;
        isMainCategory = true;
    }

    // If a sub parameter is provided, use it as the category name for filtering
    const activeSubName = subParam ? subParam : null;

    const currentCategory = CATEGORIES.find(c => c.name === categoryName);
    if (!categoryName) return notFound();

    // Filtering logic with normalization
    const categoryProducts = PRODUCTS.filter((product) => {
        const productCat = (product.category || "").trim().toLowerCase();
        const pSubCat = (product.subCategory || "").trim().toLowerCase();

        // If a specific sub-category is selected via URL query
        if (activeSubName) {
            const targetSub = activeSubName.toLowerCase();
            return productCat === targetSub || pSubCat === targetSub;
        }

        // Default behavior: Show all products in the main category or its subcategories
        const targetMainCat = categoryName.trim().toLowerCase();
        return (
            productCat === targetMainCat ||
            (currentCategory?.subcategories.some(sub => {
                const sName = sub.name.trim().toLowerCase();
                return productCat === sName || pSubCat === sName;
            }))
        );
    });

    let pattiDesc = "Premium quality dental supplies for professionals.";
    const displayTitle = activeSubName || categoryName;

    if (categoryName === 'Equipment') pattiDesc = "Modern dental chairs and clinical equipment.";
    else if (categoryName === 'Instruments') pattiDesc = "Precision tools for clinical excellence.";
    else if (categoryName === 'Consumables') pattiDesc = "High-quality materials for daily dentistry.";
    else if (categoryName === 'Endodontics') pattiDesc = "Specialized tools for root canal procedures.";
    else if (categoryName === 'Oral Care') pattiDesc = "Personal care and preventive dental products.";
    else if (categoryName === 'Eco-Sustainable') pattiDesc = "Sustainable and eco-friendly dental solutions.";

    return (
        <div className="bg-[#FAFBFF] min-h-screen py-6">
            <div className="max-w-[1500px] w-full mx-auto px-6 sm:px-10 lg:px-14">

                {/* Compact Header (The "Patti") */}
                <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6 md:mb-10">
                    <div className="relative p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 overflow-hidden">
                        <div className="flex items-center gap-3 md:gap-6 relative z-10 w-full md:w-auto">
                            {/* Dynamic Client-side Back Button */}
                            <BackButton className="w-8 h-8 md:w-10 md:h-10" />

                            <div className="flex-1">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <h1 className="text-lg md:text-2xl font-bold text-slate-900 tracking-tight leading-none">{displayTitle}</h1>
                                    <span className="bg-slate-100 text-slate-600 text-[8px] md:text-[10px] font-bold px-1.5 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wider shrink-0">{categoryProducts.length} Items</span>
                                </div>
                                <p className="text-[10px] md:text-sm text-slate-500 font-medium mt-0.5 line-clamp-1 md:line-clamp-none">{pattiDesc}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto relative z-10 mt-1 md:mt-0">
                            <div className="relative group/sort flex-1 md:flex-initial w-full sm:w-auto">
                                <select className="w-full appearance-none bg-brand-primary text-white text-center sm:text-left px-5 md:px-8 py-2 md:py-3.5 pr-8 sm:pr-10 md:pr-14 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-brand-primary/10 cursor-pointer hover:bg-brand-dark transition-all shadow-md md:shadow-lg shadow-brand-primary/20">
                                    <option>Sort: Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Top Rated</option>
                                </select>
                                <ChevronDown className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={12} />
                            </div>

                            <div className="hidden xl:flex items-center gap-2 px-4 py-3 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                                <Sparkles size={14} className="text-brand-primary" />
                                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Verified Stock</span>
                            </div>
                        </div>
                    </div>

                    {/* Compact Sub-nav tab bar */}
                    {isMainCategory && currentCategory && (
                        <div className="bg-slate-50/50 border-t border-slate-100 px-4 md:px-8 overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-4 md:gap-6 py-2 md:py-3.5 min-w-max">
                                {currentCategory.subcategories.map(sub => {
                                    const isActive = activeSubName === sub.name;
                                    return (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className={cn(
                                                "text-[10px] md:text-[12px] font-bold uppercase tracking-widest transition-all py-1.5 md:py-2 border-b-2",
                                                isActive
                                                    ? "text-brand-primary border-brand-primary"
                                                    : "text-slate-400 border-transparent hover:text-brand-primary"
                                            )}
                                        >
                                            {sub.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar - Integrated and Clean */}
                    <aside className="w-full lg:w-60 flex-shrink-0">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-6 flex items-center gap-2">
                                    <LayoutGrid size={12} /> Categories
                                </h3>
                                <div className="space-y-1">
                                    {CATEGORIES.map((cat) => (
                                        <div key={cat.name} className="space-y-1">
                                            <Link
                                                href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                className={cn(
                                                    "flex items-center justify-between text-[11px] px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all",
                                                    (cat.name === (parentCategory || categoryName))
                                                        ? "bg-brand-primary text-white"
                                                        : "text-slate-500 hover:text-brand-primary hover:bg-slate-50"
                                                )}
                                            >
                                                {cat.name}
                                            </Link>

                                            {(cat.name === (categoryName)) && (
                                                <div className="ml-4 border-l-2 border-slate-100 pl-3 py-1 space-y-1 my-1">
                                                    {cat.subcategories.map(sub => {
                                                        const isActive = activeSubName === sub.name;
                                                        return (
                                                            <Link
                                                                key={sub.name}
                                                                href={sub.href}
                                                                className={cn(
                                                                    "block text-[12px] font-bold py-2.5 px-3 rounded-lg transition-colors",
                                                                    isActive ? "text-brand-primary bg-brand-primary/5" : "text-slate-500 hover:text-brand-primary hover:bg-slate-50"
                                                                )}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="px-5 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                    <Filter size={18} />
                                </div>
                                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest leading-tight">Authentic <br />Stock</p>
                            </div>
                        </div>
                    </aside>

                    {/* Product Master Grid */}
                    <div className="flex-1">
                        <CategoryProductGrid products={categoryProducts} />

                        {categoryProducts.length === 0 && (
                            <div className="mt-8 md:mt-12 bg-white rounded-3xl border border-slate-100 p-10 md:p-20 text-center flex flex-col items-center justify-center">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">No products found</h3>
                                <p className="text-slate-400 text-sm font-medium mb-8">This collection is being updated.</p>
                                <Link
                                    href="/shop"
                                    className="px-6 md:px-8 py-3 md:py-3.5 bg-brand-primary text-white rounded-xl font-bold text-[10px] md:text-[11px] uppercase tracking-widest transition-transform active:scale-95 text-center leading-relaxed"
                                >
                                    Browse Other Collections
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
