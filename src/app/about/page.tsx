
export default function AboutPage() {
    return (
        <div className="bg-[#FAFBFF] min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-brand-dark mb-6">About Blueteeth Dentalkart</h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Blueteeth Dentalkart is India&apos;s leading B2B e-commerce platform dedicated to the dental industry.
                        Our mission is to empower dentists with high-quality equipment, transparent pricing, and seamless procurement.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl mb-12 border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <h3 className="text-4xl font-bold text-brand-primary mb-2">5000+</h3>
                            <p className="text-slate-500 font-medium">Clinics Served</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold text-brand-primary mb-2">150+</h3>
                            <p className="text-slate-500 font-medium">Brands Partnered</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold text-brand-primary mb-2">100%</h3>
                            <p className="text-slate-500 font-medium">Genuine Products</p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-lg mx-auto text-slate-600">
                    <h2 className="text-brand-dark">Our Story</h2>
                    <p>
                        Founded in 2024, Blueteeth Dentalkart emerged from a simple observation: procurement for dental clinics was fragmented, opaque, and inefficient.
                        We set out to build a platform that brings all dental supplies under one roof, with technology that simplifies inventory management and ordering.
                    </p>

                    <h2 className="text-brand-dark">Why Choose Us?</h2>
                    <ul>
                        <li><strong>Verified Authenticity:</strong> We source directly from manufacturers.</li>
                        <li><strong>Smart Logistics:</strong> Automated warehousing ensures faster dispatch.</li>
                        <li><strong>Tech-Driven:</strong> From AI search to Clinic Setup Wizards, we use tech to solve real problems.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
