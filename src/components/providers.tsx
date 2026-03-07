"use client";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <WishlistProvider>
                <CartProvider>{children}</CartProvider>
            </WishlistProvider>
        </SessionProvider>
    );
}
