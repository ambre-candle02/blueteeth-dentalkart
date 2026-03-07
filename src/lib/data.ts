
export const CATEGORIES = [
    {
        name: "Equipment",
        subcategories: [
            { name: "Diagnostic", href: "/category/equipment?sub=Diagnostic" },
            { name: "Sterilization", href: "/category/equipment?sub=Sterilization" },
            { name: "Laboratory", href: "/category/equipment?sub=Laboratory" },
            { name: "Surgical", href: "/category/equipment?sub=Surgical" },
        ],
        image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
    },
    {
        name: "Instruments",
        subcategories: [
            { name: "Handsets", href: "/category/instruments?sub=Handsets" },
            { name: "Extraction", href: "/category/instruments?sub=Extraction" },
            { name: "Orthodontic", href: "/category/instruments?sub=Orthodontic" },
            { name: "General", href: "/category/instruments?sub=General" },
        ],
        image: "https://res.cloudinary.com/dmw5efwf5/image/upload/v1772857683/media-hub/xfqsno4inozxgfvse8vk.jpg",
    },
    {
        name: "Consumables",
        subcategories: [
            { name: "Gloves", href: "/category/consumables?sub=Gloves" },
            { name: "Masks", href: "/category/consumables?sub=Masks" },
            { name: "Disinfection", href: "/category/consumables?sub=Disinfection" },
            { name: "Impression", href: "/category/consumables?sub=Impression" },
        ],
        image: "https://res.cloudinary.com/dmw5efwf5/image/upload/v1772858345/media-hub/dav3xfbxixoji4jbrlqh.webp",
    },
    {
        name: "Endodontics",
        subcategories: [
            { name: "Files", href: "/category/endodontics?sub=Files" },
            { name: "Sealers", href: "/category/endodontics?sub=Sealers" },
            { name: "Obturation", href: "/category/endodontics?sub=Obturation" },
            { name: "Apex Locators", href: "/category/endodontics?sub=Apex%20Locators" },
        ],
        image: "https://res.cloudinary.com/dmw5efwf5/image/upload/v1772857941/media-hub/b4bdxqamwhfwvnikx7ci.jpg",
    },
    {
        name: "Oral Care",
        subcategories: [
            { name: "Electric Brush", href: "/category/oral-care?sub=Electric%20Brush" },
            { name: "Manual Brushes", href: "/category/oral-care?sub=Manual%20Brushes" },
            { name: "Whitening Pastes", href: "/category/oral-care?sub=Whitening%20Pastes" },
            { name: "Specialized Care", href: "/category/oral-care?sub=Specialized%20Care" },
        ],
        image: "https://res.cloudinary.com/dmw5efwf5/image/upload/v1772858132/media-hub/j0skz71hzszvfp4qewjy.jpg",
    },
    {
        name: "Eco-Sustainable",
        subcategories: [
            { name: "Recyclable", href: "/category/eco-sustainable?sub=Recyclable" },
            { name: "Biodegradable", href: "/category/eco-sustainable?sub=Biodegradable" },
            { name: "Refillable", href: "/category/eco-sustainable?sub=Refillable" },
        ],
        image: "/images/corn-starch-brushes.png",
    },
];


export const NAV_LINKS = [
    { name: "Oral Care", href: "/category/oral-care" },
    { name: "Eco-Sustainable", href: "/category/eco-sustainable" },
    { name: "Collection", href: "/collection" },
    { name: "Freebies", href: "/freebies", badge: "New" },
    { name: "Best Sellers", href: "/best-sellers" },
    { name: "Membership", href: "/membership" },
    { name: "Events", href: "/events" },
    { name: "New Clinic Setup", href: "/new-clinic-setup", special: true },
];

export const PRODUCTS = [
    {
        id: "p1",
        name: "Premium Ergonomic Dental Chair",
        category: "Dental Chairs",
        price: 125000,
        originalPrice: 150000,
        image: "https://images.unsplash.com/photo-1598256989800-fea5ce5146c1?auto=format&fit=crop&q=80&w=600",
        rating: 4.8,
        reviews: 124,
        inStock: true,
        features: ["LED Light", "Ceramic Spittoon", "Touch Panel"],
        description: "State of the art dental chair with advanced ergonomics for maximum patient comfort.",
    },
    {
        id: "p2",
        name: "Precision Digital X-Ray Sensor",
        category: "X-Ray Sensors",
        price: 85000,
        originalPrice: 95000,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
        rating: 4.9,
        reviews: 89,
        inStock: true,
    },
    {
        id: "p3",
        name: "Professional Medical Autoclave",
        category: "Autoclaves",
        price: 45000,
        originalPrice: 52000,
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600",
        rating: 4.7,
        reviews: 210,
        inStock: true,
    },
    {
        id: "p4",
        name: "Ultra-Quiet Medical Air Compressor",
        category: "Compressors",
        price: 28500,
        originalPrice: 35000,
        image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600",
        rating: 4.5,
        reviews: 340,
        inStock: true,
    },
    {
        id: "p5",
        name: "High-Power Surgical Suction Unit",
        category: "Suction Units",
        price: 12800,
        originalPrice: 16000,
        image: "https://images.unsplash.com/photo-1584033310069-b1d5be5a21be?auto=format&fit=crop&q=80&w=600",
        rating: 4.6,
        reviews: 150,
        inStock: true,
    },
    {
        id: "p6",
        name: "Pro-Series High Speed Handpiece",
        category: "Handpieces",
        price: 2500,
        originalPrice: 3200,
        image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600",
        rating: 4.9,
        reviews: 56,
        inStock: true,
    },
];

export const TESTIMONIALS = [
    {
        id: 1,
        name: "Dr. Rajesh Gupta",
        role: "Senior Dentist, Mumbai",
        text: "Blueteeth Dentalkart revolutionized how I source my clinic supplies. The delivery is super fast and products are 100% genuine.",
        rating: 5,
    },
    {
        id: 2,
        name: "Dr. Anjali Sharma",
        role: "Orthodontist, Delhi",
        text: "The 'New Clinic Setup' feature made setting up my second branch so easy. Highly recommended for all dental professionals.",
        rating: 5,
    },
    {
        id: 3,
        name: "Dr. Vikram Singh",
        role: "Endodontist, Bangalore",
        text: "Best prices in the market. I saved significantly on my annual equipment upgrade. Customer support is also very responsive.",
        rating: 4,
    },
];
