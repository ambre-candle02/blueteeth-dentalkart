import { CATEGORIES, PRODUCTS } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Filter, ChevronDown, Sparkles, LayoutGrid } from "lucide-react";
import { CategoryProductGrid } from "@/components/features/CategoryProductGrid";
import { BackButton } from "@/components/ui/BackButton";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

    let categoryName = "";
    let parentCategory = "";
    let isMainCategory = false;

    // Robust matching for subcategory
    for (const cat of CATEGORIES) {
        const sub = cat.subcategories.find(s => s.href.split('/').pop() === slug);
        if (sub) {
            categoryName = sub.name;
            parentCategory = cat.name;
            break;
        }
    }

    // Robust matching for main category
    if (!categoryName) {
        const mainCat = CATEGORIES.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === slug);
        if (mainCat) {
            categoryName = mainCat.name;
            isMainCategory = true;
        }
    }

    const currentCategory = CATEGORIES.find(c => c.name === (isMainCategory ? categoryName : parentCategory));
    if (!categoryName) return notFound();

    // Filtering logic with normalization
    const categoryProducts = PRODUCTS.filter((product) => {
        const productCat = (product.category || "").trim();
        const targetCat = categoryName.trim();

        if (!isMainCategory) {
            return productCat.toLowerCase() === targetCat.toLowerCase();
        }

        if (isMainCategory && currentCategory) {
            return (
                productCat.toLowerCase() === targetCat.toLowerCase() ||
                currentCategory.subcategories.some(sub => sub.name.trim().toLowerCase() === productCat.toLowerCase())
            );
        }
        return false;
    });

    let pattiDesc = "Premium quality dental supplies for professionals.";
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
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
                    <div className="relative p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                            {/* Dynamic Client-side Back Button */}
                            <BackButton />

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{categoryName}</h1>
                                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{categoryProducts.length} Items</span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">{pattiDesc}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
                            <div className="relative group/sort flex-1 md:flex-initial">
                                <select className="w-full appearance-none bg-brand-primary text-white px-8 py-3.5 pr-14 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-brand-primary/10 cursor-pointer hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20">
                                    <option>Sort: Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Top Rated</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16} />
                            </div>

                            <div className="hidden xl:flex items-center gap-2 px-4 py-3 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                                <Sparkles size={14} className="text-brand-primary" />
                                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Verified Stock</span>
                            </div>
                        </div>
                    </div>

                    {/* Compact Sub-nav tab bar */}
                    {isMainCategory && currentCategory && (
                        <div className="bg-slate-50/50 border-t border-slate-100 px-8 overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-6 py-3.5 min-w-max">
                                {currentCategory.subcategories.map(sub => (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-all"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
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

                                            {(cat.name === (parentCategory || categoryName)) && (
                                                <div className="ml-4 border-l-2 border-slate-100 pl-3 py-1 space-y-1 my-1">
                                                    {cat.subcategories.map(sub => (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className={cn(
                                                                "block text-[11px] font-bold py-2 px-3 rounded-lg transition-colors",
                                                                categoryName === sub.name ? "text-brand-primary" : "text-slate-500 hover:text-brand-primary"
                                                            )}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
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
                            <div className="mt-12 bg-white rounded-3xl border border-slate-100 p-20 text-center">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">No products found</h3>
                                <p className="text-slate-400 text-sm font-medium mb-8">This collection is being updated.</p>
                                <Link
                                    href="/collection"
                                    className="px-8 py-3.5 bg-brand-primary text-white rounded-xl font-bold text-[11px] uppercase tracking-widest"
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
