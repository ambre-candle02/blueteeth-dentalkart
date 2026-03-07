import { Suspense } from "react";
import { getProducts } from "@/actions/product-actions";
import ShopContent from "../../components/features/ShopContent";


export default async function ShopPage() {
    // Fetch live products from database
    const { products: dbProducts = [] } = await getProducts();

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAFBFF]"><div className="animate-spin w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full" /></div>}>
            <ShopContent dbProducts={dbProducts} />
        </Suspense>
    );
}
