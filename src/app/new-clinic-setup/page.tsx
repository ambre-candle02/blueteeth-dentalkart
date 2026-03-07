import { ClinicWizard } from "@/components/features/ClinicWizard/ClinicWizard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewClinicSetupPage() {
    return (
        <div className="min-h-screen bg-[#FAFBFF] py-12">
            <div className="container mx-auto px-4">

                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-dark px-4 py-2 rounded-full shadow-sm transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-brand-dark mb-4">New Clinic Setup</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Planning a new practice? Use our interactive wizard to estimate costs, select equipment, and plan finances.
                    </p>
                </div>

                <ClinicWizard />
            </div>
        </div>
    );
}
