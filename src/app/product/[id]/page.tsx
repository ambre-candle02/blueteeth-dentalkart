import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/features/ProductGallery";
import { ProductInfo } from "@/components/features/ProductInfo";
import { ProductRow } from "@/components/features/ProductRow";
import { StickyCart } from "@/components/features/StickyCart";
import { BackButton } from "@/components/ui/BackButton";
import { getProductById, getProducts } from "@/actions/product-actions";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch product details
    const result = await getProductById(id);
    if (!result.success || !result.product) {
        notFound();
    }
    const product = result.product;

    // Fetch related products (same category)
    const allProductsResult = await getProducts();
    const relatedProducts = allProductsResult.success
        ? allProductsResult.products.filter((p: any) => p.category === product.category && p.id !== product.id).slice(0, 4)
        : [];

    return (
        <div className="min-h-screen">
            {/* Product Detail Zone */}
            <div className="bg-[#FAFBFF] pb-10 relative overflow-hidden border-b border-slate-100/60">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />

                <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10 py-6 relative z-10">
                    <BackButton />

                    <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border-2 border-slate-100 overflow-hidden relative group/container">
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-brand-primary/[0.005] pointer-events-none" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10">
                            {/* Gallery Area */}
                            <div className="lg:col-span-6 p-5 md:p-10 flex items-center justify-center bg-white">
                                <ProductGallery product={product} />
                            </div>

                            {/* Divider Line (Desktop) */}
                            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-slate-100 to-transparent self-stretch" />

                            {/* Product Info Area */}
                            <div className="lg:col-span-5 p-5 md:p-10 bg-white overflow-hidden self-center">
                                <ProductInfo product={product} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Elegant divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-12" />

            {/* Related Products Zone — premium subtle gradient */}
            <div className="w-full bg-gradient-to-b from-slate-50 to-white border-t border-slate-100 py-4">
                <div className="container mx-auto px-4">
                    <ProductRow
                        title="Related Expert Solutions"
                        products={relatedProducts}
                        sectionClassName="bg-transparent"
                        showBadge={true}
                    />
                </div>
            </div>

            {/* Sticky Add to Cart for Mobile/Scroll */}
            <StickyCart product={product} />
        </div>
    );
}
