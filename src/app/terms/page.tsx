import PolicyLayout from "@/components/layout/PolicyLayout";

export default function TermsPage() {
    return (
        <PolicyLayout title="Terms of Service">
            <p>By using Blueteeth Dentalkart, you agree to our professional terms for B2B dental supplies.</p>
            <h2 className="text-xl font-bold text-slate-800">1. Eligibility</h2>
            <p>Our services are exclusively for registered dental professionals and healthcare institutions.</p>
            <h2 className="text-xl font-bold text-slate-800">2. Professional Responsibility</h2>
            <p>Users are responsible for ensuring the medical equipment purchased matches their professional certifications and requirements.</p>
        </PolicyLayout>
    );
}
