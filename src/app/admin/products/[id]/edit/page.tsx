import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/actions/product-actions";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Attempt to fetch from DB
    let { product, success } = await getProductById(id);

    // Fallback exactly like we do in actions, if needed
    if (!success || !product) {
        let staticProduct = PRODUCTS.find(p => p.id === id) || (PRODUCTS as any).find((p: any) => p._id === id);
        if (staticProduct) {
            product = {
                ...staticProduct,
                _id: staticProduct.id || staticProduct._id,
                images: [{ url: staticProduct.image }]
            }
            success = true;
        }
    }

    if (!success || !product) {
        notFound();
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <ProductForm initialData={product} />
        </div>
    );
}
