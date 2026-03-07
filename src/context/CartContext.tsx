"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    config: any;
    isSystemLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [isSystemLoading, setIsSystemLoading] = useState(true);

    // Load settings and cart
    useEffect(() => {
        const init = async () => {
            try {
                // Fetch dynamic admin settings
                const { getGlobalConfig } = await import("@/actions/admin-settings");
                const globalConfig = await getGlobalConfig();
                setConfig(globalConfig);

                // Load cart
                const savedCart = localStorage.getItem("blueteeth-cart");
                if (savedCart) {
                    const parsedItems: CartItem[] = JSON.parse(savedCart);
                    const { PRODUCTS } = require("@/lib/data");
                    const syncedItems = parsedItems.map(item => {
                        const latestProduct = PRODUCTS.find((p: any) => p.id === item.id);
                        if (latestProduct) {
                            return {
                                ...item,
                                image: latestProduct.image,
                                price: latestProduct.price,
                                name: latestProduct.name,
                                category: latestProduct.category
                            };
                        }
                        return item;
                    });
                    setItems(syncedItems);
                }
            } catch (e) {
                console.error("Cart Init Error:", e);
            } finally {
                setIsLoaded(true);
                setIsSystemLoading(false);
            }
        };

        init();
    }, []);


    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("blueteeth-cart", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (product: Product, quantity = 1) => {
        const { toast } = require("sonner");

        if (config?.maintenanceMode) {
            toast.error("Shopping is temporarily disabled for maintenance.");
            return;
        }

        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            const maxAllowedGlobal = config?.maxCartItems || 10;
            const maxProductLimit = product.maxCartQuantity || 999;

            if (existing) {
                const newQuantity = existing.quantity + quantity;
                if (newQuantity > maxProductLimit) {
                    toast.error(`You can only purchase up to ${maxProductLimit} units of this specific item.`);
                    return prev;
                }
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }

            // New item addition
            if (prev.length >= maxAllowedGlobal) {
                toast.error(`Cart limit of ${maxAllowedGlobal} unique items reached.`);
                return prev;
            }

            if (quantity > maxProductLimit) {
                toast.error(`Maximum order limit for this product is ${maxProductLimit}.`);
                return prev;
            }

            return [...prev, { ...product, quantity }];
        });
    };


    const removeItem = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                config,
                isSystemLoading
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
