export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    stockStatus?: string;
    subCategory?: string;
    maxCartQuantity?: number;
    description?: string;
    fullDetails?: string;
    features?: string[];
    images?: { url: string; label: string }[];
}


export interface CartItem extends Product {
    quantity: number;
}

export interface WishlistItem extends Product {
    addedAt: Date;
}
