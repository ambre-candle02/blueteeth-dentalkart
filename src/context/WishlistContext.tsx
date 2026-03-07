"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Product, WishlistItem } from "@/types";
import { useSession } from "next-auth/react";
import { syncWishlistToCloud, getWishlistFromCloud } from "@/actions/wishlist-actions";

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const { data: session, status } = useSession();
    const sessionLoaded = useRef(false);

    useEffect(() => {
        const initializeWishlist = async () => {
            let loadedItems: WishlistItem[] = [];

            // 1. Try cloud if authenticated
            if (session && session.user) {
                const cloudData = await getWishlistFromCloud();
                if (cloudData.success && cloudData.items.length > 0) {
                    loadedItems = cloudData.items.map((i: any) => ({
                        ...i,
                        addedAt: new Date(i.addedAt)
                    }));
                }
            }

            // 2. Fallback to localStorage
            if (loadedItems.length === 0) {
                const savedWishlist = localStorage.getItem("blueteeth-wishlist");
                if (savedWishlist) {
                    try {
                        const parsedItems = JSON.parse(savedWishlist);
                        loadedItems = parsedItems.map((item: any) => ({
                            ...item,
                            addedAt: new Date(item.addedAt)
                        }));
                    } catch (e) {
                        console.error("Failed to parse local wishlist data", e);
                    }
                }
            }

            setItems(loadedItems);
            setIsLoaded(true);
            sessionLoaded.current = true;
        };

        if (status !== 'loading' && !sessionLoaded.current) {
            initializeWishlist();
        }
    }, [status, session]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("blueteeth-wishlist", JSON.stringify(items));
            if (session && session.user) {
                syncWishlistToCloud(items);
            }
        }
    }, [items, isLoaded, session]);

    const addToWishlist = (product: Product) => {
        setItems((prev) => {
            if (prev.some((item) => item.id === product.id)) return prev;
            return [...prev, { ...product, addedAt: new Date() }];
        });
    };

    const removeFromWishlist = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const isInWishlist = (productId: string) => {
        return items.some((item) => item.id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
