import { Hero } from "@/components/layout/Hero";
import { TrustStrip } from "@/components/features/TrustStrip";
import { CategoryGrid } from "@/components/features/CategoryGrid";
import { ProductRow } from "@/components/features/ProductRow";
import { Testimonials } from "@/components/features/Testimonials";
import { PRODUCTS } from "@/lib/data";
import { getProducts } from "@/actions/product-actions";

export default async function Home() {
  const { products: dbProducts = [] } = await getProducts();

  // Combine db products over static products based on ID.
  const allProducts = [...dbProducts];
  const dbProductIds = new Set(dbProducts.map((p: any) => p.id));
  PRODUCTS.forEach(p => {
    if (!dbProductIds.has(p.id)) {
      allProducts.push(p);
    }
  });

  const bestSellers = allProducts.slice(0, 10);
  const newArrivals = [...allProducts].reverse().slice(0, 10);

  return (
    <div className="flex flex-col gap-0 w-full overflow-hidden">
      <Hero />
      <div className="w-full bg-[#FAFBFF]">
        <TrustStrip />
        <ProductRow title="Best Sellers" products={bestSellers} viewAllLink="/best-sellers" />
        <CategoryGrid />
        <ProductRow title="New Arrivals" products={newArrivals} viewAllLink="/new-arrivals" />
        <Testimonials />
      </div>
    </div>
  );
}
