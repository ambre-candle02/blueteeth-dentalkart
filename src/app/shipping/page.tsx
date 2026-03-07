import PolicyLayout from "@/components/layout/PolicyLayout";

export default function ShippingPage() {
    return (
        <PolicyLayout title="Shipping Policy">
            <p>Blueteeth Dentalkart ensures priority delivery for all clinical equipment and supplies.</p>
            <h2 className="text-xl font-bold text-slate-800">1. Delivery Timeline</h2>
            <p>Standard orders are dispatched within 24 hours. Delivery typically takes 2-5 business days depending on the clinic location.</p>
            <h2 className="text-xl font-bold text-slate-800">2. Fragile Equipment</h2>
            <p>Our heavy equipment like dental chairs are shipped via specialized medical logistics partners with on-site installation support.</p>
        </PolicyLayout>
    );
}
