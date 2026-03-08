"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, ChevronRight, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORIES, NAV_LINKS } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();
    const pathname = usePathname();

    const { data: session, status, update } = useSession();
    const { cartCount } = useCart();
    const { items: wishlistItems } = useWishlist();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false); // Close mobile menu if open
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={cn(
            "sticky top-0 z-50 will-change-transform",
            isScrolled
                ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]"
                : "bg-white border-b border-transparent"
        )}>
            {/* Main Navbar */}
            <div className="max-w-[1600px] w-full mx-auto px-2 sm:px-4 md:px-8 lg:px-16 xl:px-20 h-16 md:h-20 flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1 sm:gap-2 group active:scale-95 transition-transform duration-200">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-primary rounded-lg md:rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl group-hover:bg-brand-accent transition-colors shrink-0">
                        B
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base sm:text-lg md:text-xl font-bold text-brand-dark leading-tight">Blueteeth</span>
                        <span className="hidden xs:block text-[10px] md:text-xs text-brand-primary font-medium tracking-wider uppercase">DENTAL STORE</span>
                    </div>
                </Link>

                {/* Desktop Search - Raised Premium Look */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-12 py-2">
                    <form onSubmit={handleSearch} className="relative group w-full flex bg-slate-50/50 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.06)] hover:bg-white hover:border-brand-primary/30 focus-within:shadow-md focus-within:bg-white focus-within:border-brand-primary/60 rounded-full transition-all duration-300 items-center overflow-hidden">
                        <Search className="absolute left-5 text-slate-400 w-[18px] h-[18px] group-focus-within:text-brand-primary transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="Search for premium dental supplies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent py-3.5 pl-12 pr-28 text-sm focus:outline-none text-slate-900 placeholder:text-slate-400 relative z-0"
                        />
                        <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 bg-brand-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-brand-dark transition-all active:scale-95 shrink-0 shadow-sm z-10 flex items-center justify-center">
                            Search
                        </button>
                    </form>
                </div>

                {/* Icons Area */}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
                    {/* Wishlist Box */}
                    <Link href="/wishlist" className="p-1 sm:p-1.5 md:p-2.5 rounded-full transition-all border border-slate-200/80 bg-slate-50/50 shadow-sm hover:shadow-md hover:border-brand-primary/30 hover:bg-white active:scale-90 group relative">
                        <div className="bg-white border border-slate-100 shadow-sm p-1 sm:p-1.5 rounded-full group-hover:bg-brand-primary/5 transition-colors">
                            <Heart className="w-[18px] h-[18px] text-slate-600 group-hover:text-brand-primary/50 group-hover:fill-brand-primary/50 transition-all duration-300" />
                        </div>
                        {wishlistItems.length > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-sm z-10"></span>
                        )}
                    </Link>

                    {/* Cart Box */}
                    <Link href="/cart" className="p-1 sm:p-1.5 md:p-2.5 rounded-full transition-all border border-slate-200/80 bg-slate-50/50 shadow-sm hover:shadow-md hover:border-brand-primary/30 hover:bg-white active:scale-90 group relative">
                        <div className="bg-white border border-slate-100 shadow-sm p-1 sm:p-1.5 rounded-full group-hover:bg-brand-light transition-colors">
                            <ShoppingCart className="w-[18px] h-[18px] text-slate-600 group-hover:text-brand-primary transition-colors" />
                        </div>
                        {cartCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-brand-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold px-1.5 border border-white shadow-sm z-10 -mr-2 -mt-2">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Admin Panel Link - Only for Admins */}
                    {(session?.user as any)?.role === 'ADMIN' && (
                        <Link href="/admin" className="hidden sm:flex items-center gap-2 p-1.5 md:pr-4 rounded-full transition-all border border-brand-primary/20 bg-brand-primary/5 shadow-sm hover:shadow-md hover:border-brand-primary/40 hover:bg-brand-primary/10 group">
                            <div className="bg-brand-primary text-white p-1.5 rounded-full shadow-sm">
                                <LayoutDashboard className="w-[18px] h-[18px]" />
                            </div>
                            <span className="hidden md:block text-sm font-black text-brand-primary uppercase tracking-tighter">
                                Admin
                            </span>
                        </Link>
                    )}

                    {/* Profile Box */}
                    <Link href="/profile" className="flex items-center gap-2 p-1 sm:p-1.5 md:pr-4 rounded-full transition-all border border-slate-200/80 bg-slate-50/50 shadow-sm hover:shadow-md hover:border-brand-primary/30 hover:bg-white group">
                        <div className="bg-white border border-slate-100 shadow-sm p-1 sm:p-1.5 rounded-full group-hover:bg-brand-light transition-colors">
                            <User className="w-[18px] h-[18px] text-slate-600 group-hover:text-brand-primary transition-colors" />
                        </div>
                        <span className="hidden md:block text-sm font-bold text-slate-700 group-hover:text-brand-primary transition-colors">
                            {status === 'loading' ? (
                                <div className="w-12 h-3 bg-slate-200 animate-pulse rounded-full" />
                            ) : session?.user ? (
                                session.user.name?.split(' ')[0]
                            ) : (
                                "Login"
                            )}
                        </span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-1 sm:p-1.5 hover:bg-slate-50 rounded-full transition-colors ml-0 sm:ml-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />}
                    </button>
                </div>
            </div>

            {/* Secondary Navigation Bar */}
            <nav className="hidden md:block py-3 border-t border-slate-200 border-b border-slate-200 bg-white relative z-10">
                <div className="max-w-[1600px] w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 flex items-center justify-between gap-4">
                    {/* Mega Menu Trigger */}
                    <div
                        className="relative group shrink-0"
                        onMouseEnter={() => setIsMegaMenuOpen(true)}
                        onMouseLeave={() => setIsMegaMenuOpen(false)}
                    >
                        <button className="flex items-center gap-2.5 font-bold text-slate-800 hover:text-brand-primary transition-all py-2.5 px-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 whitespace-nowrap">
                            <Menu className="w-5 h-5 text-brand-primary" />
                            Shop Categories
                            <ChevronDown className="w-4 h-4 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <AnimatePresence>
                            {isMegaMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-[calc(100%+8px)] left-0 w-[850px] bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 p-6 z-50 grid grid-cols-12 gap-8 before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"
                                >
                                    {/* Category List */}
                                    <div className="col-span-4 border-r border-slate-100 pr-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Departments</h4>
                                        <div className="space-y-1">
                                            {CATEGORIES.map((cat, idx) => {
                                                const isActive = (activeCategory || CATEGORIES[0].name) === cat.name;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={cn(
                                                            "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group/cat",
                                                            isActive
                                                                ? "bg-[#f0f4fc] text-[#0052cc] font-black shadow-[inset_0_0_0_1px_rgba(0,82,204,0.1)]"
                                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold"
                                                        )}
                                                        onMouseEnter={() => setActiveCategory(cat.name)}
                                                    >
                                                        <span>{cat.name}</span>
                                                        <ChevronRight className={cn("w-4 h-4 transition-transform", isActive ? "translate-x-1 opacity-100" : "opacity-0 -translate-x-2 group-hover/cat:opacity-100 group-hover/cat:translate-x-0")} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Subcategories */}
                                    <div className="col-span-4 py-1">
                                        <h3 className="font-black text-[#0052cc] text-xl mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                                            {(activeCategory || CATEGORIES[0].name)}
                                        </h3>
                                        <ul className="space-y-1">
                                            {CATEGORIES.find(c => c.name === (activeCategory || CATEGORIES[0].name))?.subcategories.map((sub, idx) => (
                                                <li key={idx}>
                                                    <Link
                                                        href={sub.href}
                                                        className="text-slate-600 hover:text-[#0052cc] hover:font-bold text-sm transition-all block px-3 py-2 rounded-lg hover:bg-[#f0f4fc] group/link flex items-center gap-2.5"
                                                        onClick={() => setIsMegaMenuOpen(false)}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/link:bg-[#0052cc] transition-colors" />
                                                        <span className="group-hover/link:translate-x-1 transition-transform">{sub.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                            <li className="pt-3 mt-3">
                                                <Link
                                                    href={`/category/${(activeCategory || CATEGORIES[0].name).toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="inline-flex items-center gap-1.5 text-white bg-[#0052cc] hover:bg-[#0040a8] font-bold text-xs py-2 px-4 rounded-lg transition-colors shadow-sm"
                                                    onClick={() => setIsMegaMenuOpen(false)}
                                                >
                                                    View All Products <ChevronRight size={12} strokeWidth={3} />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Promo Area Dynamic */}
                                    <div className="col-span-4 relative rounded-xl overflow-hidden group/promo h-full border border-slate-100 bg-slate-50 shadow-inner min-h-[250px]">
                                        {(() => {
                                            const currentCat = CATEGORIES.find(c => c.name === (activeCategory || CATEGORIES[0].name));
                                            return (
                                                <>
                                                    {currentCat?.image && (
                                                        <img src={currentCat.image} alt={currentCat.name} className="absolute inset-0 w-full h-full object-cover group-hover/promo:scale-110 transition-transform duration-1000 ease-out text-transparent" />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent" />

                                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                                        <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] w-fit mb-3 border border-white/20 shadow-sm">
                                                            Top Selection
                                                        </span>
                                                        <h4 className="font-black text-xl text-white mb-2 leading-tight drop-shadow-md">
                                                            {currentCat?.name === 'Equipment' ? 'Modern Clinic Setup' : `Premium ${currentCat?.name}`}
                                                        </h4>
                                                        <p className="text-slate-200 text-xs mb-5 font-medium line-clamp-2 drop-shadow-sm leading-relaxed">
                                                            Explore our latest range of highly rated {currentCat?.name.toLowerCase()} supplies.
                                                        </p>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Standard Links */}
                    <div className="flex-1 flex items-center justify-center gap-x-0 lg:gap-x-2">
                        {NAV_LINKS.filter(link => !link.special).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-[13px] xl:text-sm font-medium transition-all relative group whitespace-nowrap px-2.5 lg:px-4 py-2 rounded-full",
                                    "text-slate-700 hover:text-brand-primary hover:bg-brand-primary/5"
                                )}
                            >
                                {link.name}
                                {link.badge && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm shadow-red-500/30">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="shrink-0 ml-2 lg:ml-4">
                        {NAV_LINKS.filter(link => link.special).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="group relative overflow-hidden inline-flex items-center justify-center bg-brand-primary text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-brand-dark transition-all shadow-[0_4px_12px_rgba(0,86,210,0.2)] hover:shadow-[0_6px_20px_rgba(0,86,210,0.3)] hover:-translate-y-0.5 whitespace-nowrap"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_2.5s_infinite]" />
                                {link.name}
                                {link.badge && (
                                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border-2 border-brand-primary">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 dark:bg-slate-900 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-brand-primary/50 hover:border-brand-primary dark:border-brand-primary/50 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-all dark:bg-slate-800"
                                />
                                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>

                            <div className="space-y-1">
                                {CATEGORIES.map((cat) => (
                                    <Link
                                        key={cat.name}
                                        href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="py-3 border-b border-slate-50 dark:border-slate-800 last:border-0 block group/mob"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className="font-medium text-slate-800 dark:text-white flex justify-between items-center group-hover/mob:text-brand-primary transition-colors">
                                            {cat.name}
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover/mob:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-2 flex flex-col gap-2">
                                {NAV_LINKS.map(link => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "py-2 px-3 rounded-lg text-sm font-medium",
                                            link.special ? "bg-brand-primary text-white text-center" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header >
    );
}
