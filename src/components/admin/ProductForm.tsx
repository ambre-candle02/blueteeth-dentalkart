"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product-actions";
import { uploadImageToCloudinary } from "@/actions/upload-actions";
import { toast } from "sonner";
import {
    Save, Plus, Trash2, Image as ImageIcon, Loader2, UploadCloud,
    Tag, Percent, Info, ListFilter, Warehouse, Sparkles,
    ShoppingBag, AlertCircle, Clock, ArrowLeft
} from "lucide-react";

const CATEGORIES: Record<string, string[]> = {
    "Equipment": ["Diagnostic", "Sterilization", "Laboratory", "Surgical"],
    "Instruments": ["Handsets", "Extraction", "Orthodontic", "General"],
    "Consumables": ["Gloves", "Masks", "Disinfection", "Impression"],
    "Endodontics": ["Files", "Sealers", "Obturation", "Apex Locators"],
    "Oral Care": ["Electric Brush", "Manual Brushes", "Whitening Pastes", "Specialized Care"],
    "Eco-Sustainable": ["Recyclable", "Biodegradable", "Refillable"],
    "Membership": ["Bronze", "Silver", "Gold", "Platinum"],
    "Events": ["Webinars", "Hands-on", "Conferences", "Workshops"]
};

const STOCK_STATUSES = [
    { id: "in-stock", label: "In Stock", color: "bg-emerald-500", icon: <Warehouse size={16} /> },
    { id: "out-of-stock", label: "Out of Stock", color: "bg-red-500", icon: <AlertCircle size={16} /> },
    { id: "coming-soon", label: "Coming Soon", color: "bg-amber-500", icon: <Clock size={16} /> }
];

export default function ProductForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryCategory = searchParams.get("category");

    const [loading, setLoading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const defaultImages = [
        { url: "", label: "01 - Front" },
        { url: "", label: "02 - Back" },
        { url: "", label: "03 - Left / Angle" },
        { url: "", label: "04 - Right / Detail" }
    ];

    const [images, setImages] = useState(() => {
        if (initialData?.images?.length) {
            const merged = [...initialData.images];
            while (merged.length < 4) {
                merged.push(defaultImages[merged.length]);
            }
            return merged.slice(0, 4);
        }
        return defaultImages;
    });

    // Dynamic Category Selection
    const [selectedCategory, setSelectedCategory] = useState(
        initialData?.category || (queryCategory && CATEGORIES[queryCategory] ? queryCategory : Object.keys(CATEGORIES)[0])
    );
    const [selectedSubCategory, setSelectedSubCategory] = useState(initialData?.subCategory || "");
    const [selectedStockStatus, setSelectedStockStatus] = useState(initialData?.stockStatus || "in-stock");

    useEffect(() => {
        if (!initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedSubCategory(CATEGORIES[selectedCategory][0]);
        }
    }, [selectedCategory, initialData]);

    const handleImageChange = (index: number, field: string, value: string) => {
        const newImages = [...images];
        newImages[index][field] = value;
        setImages(newImages);
    };

    const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIndex(index);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `${selectedCategory.replace(/[^a-zA-Z0-9_\-\s]/g, '_')}/${selectedSubCategory.replace(/[^a-zA-Z0-9_\-\s]/g, '_')}`);

        const result = await uploadImageToCloudinary(formData);
        if (result.success && result.url) {
            handleImageChange(index, "url", result.url);
            toast.success("Image uploaded!");
        } else {
            toast.error(result.error || "Upload failed");
        }
        setUploadingIndex(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validImages = images.filter((img: any) => img.url);
        if (validImages.length === 0) {
            return toast.error("Please append at least one visual asset.");
        }

        if (uploadingIndex !== null) {
            return toast.error("Please wait for media uploads to finish.");
        }

        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name")?.toString() || "",
            description: formData.get("description")?.toString() || "",
            fullDetails: formData.get("fullDetails")?.toString() || "",
            price: Number(formData.get("price")) || 0,
            discountPercentage: Number(formData.get("discountPercentage")) || 0,
            category: selectedCategory || "",
            subCategory: selectedSubCategory || "",
            brand: formData.get("brand")?.toString() || "",
            stock: Number(formData.get("stock")) || 0,
            stockStatus: formData.get("stockStatus")?.toString() || "in-stock",
            maxCartQuantity: Number(formData.get("maxCartQuantity")) || 10,
            isFeatured: formData.get("isFeatured") === "on",
            images: validImages.map((img: any) => ({ url: img.url, label: img.label })),
            image: validImages[0]?.url || "" // Primary image
        };

        const result = initialData
            ? await updateProduct(initialData.id, data)
            : await createProduct(data);

        if (result.success) {
            toast.success(initialData ? "Product updated!" : "Product created!");
            router.push("/admin/products");
            router.refresh();
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="pb-32 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-brand-dark tracking-tight">
                        {initialData ? "Refine Asset" : "Initialize Asset"}
                    </h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ecosystem Protocol 0.2 // Asset Management</p>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={() => router.back()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Return to Hub
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Core Data */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-light rounded-xl text-brand-primary border border-brand-primary/10">
                                    <Info size={16} />
                                </div>
                                <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest">Asset Identity</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                                    <Sparkles size={14} className="text-brand-accent" />
                                    <span className="text-[9px] font-black text-brand-dark uppercase tracking-widest">Priority</span>
                                    <label className="relative inline-flex items-center cursor-pointer scale-90">
                                        <input name="isFeatured" type="checkbox" className="sr-only peer" defaultChecked={!!initialData?.isFeatured} />
                                        <div className="w-10 h-5 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                                    </label>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">ID Protocol</label>
                                    <span className="text-[10px] font-black tabular-nums text-slate-500">{initialData?.id ? initialData.id.substring(0, 12) : "New Protocol"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Nomenclature</label>
                                <input
                                    name="name"
                                    defaultValue={initialData?.name || ""}
                                    required
                                    placeholder="e.g. Blueteeth Pro-Series"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-black text-lg text-brand-dark placeholder:text-slate-300 shadow-inner"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin Node (Brand)</label>
                                <input
                                    name="brand"
                                    defaultValue={initialData?.brand || ""}
                                    placeholder="e.g. ORAL-ECO"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-black text-sm text-brand-dark placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={initialData?.description || ""}
                                    required
                                    rows={3}
                                    placeholder="Brief conceptual overview..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all text-xs font-bold leading-relaxed resize-none text-slate-600 shadow-inner"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Structural Details</label>
                                <textarea
                                    name="fullDetails"
                                    defaultValue={initialData?.fullDetails || ""}
                                    required
                                    rows={3}
                                    placeholder="Full technical data..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all text-xs font-bold leading-relaxed resize-none text-slate-600 shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Commercial Data */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                                    <Tag size={16} />
                                </div>
                                <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest">Pricing Matrix</h2>
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">Currency: INR (₹)</div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Cost</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/20 font-black text-xs transition-colors group-focus-within:text-brand-primary">₹</span>
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        defaultValue={initialData?.price ?? ""}
                                        required
                                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-black text-lg text-brand-dark shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Yield Adj (%)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/30 group-focus-within:text-emerald-500 transition-colors">
                                        <Percent size={12} />
                                    </div>
                                    <input
                                        name="discountPercentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        defaultValue={initialData?.discountPercentage ?? 0}
                                        className="w-full pl-10 pr-4 py-3 bg-emerald-50/20 border border-emerald-100/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-black text-lg text-emerald-600 shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cart Throttle</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30 group-focus-within:text-brand-primary transition-colors">
                                        <ShoppingBag size={12} />
                                    </div>
                                    <input
                                        name="maxCartQuantity"
                                        type="number"
                                        min="1"
                                        defaultValue={initialData?.maxCartQuantity ?? 10}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-black text-lg text-brand-dark shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Assets */}
                    {/* Media Assets */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                                    <ImageIcon size={16} />
                                </div>
                                <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest">Visual Index</h2>
                            </div>
                            <div className="bg-slate-50 px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Sync Path: <span className="text-brand-primary">{selectedCategory} / {selectedSubCategory}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {images.slice(0, 4).map((img: any, idx: number) => (
                                <div key={idx} className="relative group aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center hover:border-brand-primary/50 hover:bg-brand-50/10 transition-all cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(idx, e)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        disabled={uploadingIndex === idx}
                                    />

                                    {img.url ? (
                                        <>
                                            <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`View ${idx + 1}`} />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                                                    <UploadCloud size={24} />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    handleImageChange(idx, "url", "");
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-white text-red-500 rounded-lg opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg transition-all z-20"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-900 border border-white max-w-full truncate text-center shadow-lg">
                                                {img.label}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center space-y-3 pointer-events-none transition-transform group-hover:-translate-y-1">
                                            <div className="w-12 h-12 mx-auto bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-brand-primary group-hover:shadow-md transition-all">
                                                {uploadingIndex === idx ? <Loader2 size={20} className="animate-spin text-brand-primary" /> : <Plus size={20} strokeWidth={3} />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark">{img.label}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">Upload Aspect</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Taxonomy & Logistics */}
                <div className="space-y-6">
                    {/* Integrated Sidebar */}
                    <div className="bg-brand-dark p-6 rounded-[2.5rem] shadow-2xl space-y-8 border border-white/5">
                        {/* Domain & Specialty */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <div className="p-2 bg-white/5 rounded-xl text-brand-primary">
                                    <ListFilter size={16} />
                                </div>
                                <h2 className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">Clinical Taxonomy</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Core Sector</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all font-black text-xs appearance-none cursor-pointer hover:bg-white/10 text-white"
                                    >
                                        {Object.keys(CATEGORIES).map(cat => (
                                            <option key={cat} className="bg-brand-dark text-white font-sans">{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Specialty Protocol</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {CATEGORIES[selectedCategory].map(sub => (
                                            <button
                                                key={sub}
                                                type="button"
                                                onClick={() => setSelectedSubCategory(sub)}
                                                className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-left transition-all border ${selectedSubCategory === sub
                                                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20'
                                                    : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20 hover:text-white'
                                                    }`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logistics */}
                        <div className="space-y-6 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <div className="p-2 bg-white/5 rounded-xl text-emerald-400">
                                    <Warehouse size={16} />
                                </div>
                                <h2 className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">Logistics Control</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2.5">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Supply State</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {STOCK_STATUSES.map(status => (
                                            <label onClick={() => setSelectedStockStatus(status.id)} key={status.id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${selectedStockStatus === status.id ? 'bg-white/10 border-brand-primary shadow-sm' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${status.color.replace('bg-', 'bg-')}`}></div>
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{status.label}</span>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="stockStatus"
                                                    value={status.id}
                                                    checked={selectedStockStatus === status.id}
                                                    onChange={(e) => setSelectedStockStatus(e.target.value)}
                                                    className="sr-only"
                                                />
                                                {selectedStockStatus === status.id && (
                                                    <div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Warehouse Depth (Units)</label>
                                    <input
                                        name="stock"
                                        type="number"
                                        min="0"
                                        defaultValue={initialData?.stock ?? 0}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all font-black text-lg text-white shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-2">
                            <button
                                disabled={loading || uploadingIndex !== null}
                                className="w-full relative group overflow-hidden rounded-2xl shadow-2xl"
                            >
                                <div className="relative w-full bg-brand-primary text-white py-4 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-brand-dark transition-all">
                                    {loading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <><Save size={16} /> Commit To Matrix</>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    );
}
