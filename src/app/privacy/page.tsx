import PolicyLayout from "@/components/layout/PolicyLayout";

export default function PrivacyPage() {
    return (
        <PolicyLayout title="Privacy Policy">
            <p>At Blueteeth Dentalkart, we prioritize the protection of your clinical and professional data.</p>
            <h2 className="text-xl font-bold text-slate-800">1. Data Collection</h2>
            <p>We collect essential information to process your orders and provide a personalized experience for your dental practice.</p>
            <h2 className="text-xl font-bold text-slate-800">2. Professional Security</h2>
            <p>Your transaction details are encrypted using enterprise-grade protocols to ensure clinical confidentiality.</p>
        </PolicyLayout>
    );
}
