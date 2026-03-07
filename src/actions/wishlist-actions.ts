'use server';

import { db } from '@/lib/firebase-admin';
import { auth } from '@/auth';
import { WishlistItem } from '@/types';

export async function syncWishlistToCloud(items: WishlistItem[]) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) return { success: false, error: 'Unauthorized' };

        const userRef = db.collection('wishlists').doc(session.user.id);

        // Clean up data for firestore
        const cloudData = items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            addedAt: item.addedAt ? new Date(item.addedAt).toISOString() : new Date().toISOString()
        }));

        await userRef.set({ items: cloudData, updatedAt: new Date().toISOString() });
        return { success: true };
    } catch (error: any) {
        console.error("Failed to sync wishlist to cloud", error);
        return { success: false, error: error.message };
    }
}

export async function getWishlistFromCloud() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) return { success: false, error: 'Unauthorized', items: [] };

        const userRef = db.collection('wishlists').doc(session.user.id);
        const doc = await userRef.get();

        if (doc.exists) {
            return { success: true, items: doc.data()?.items || [] };
        }
        return { success: true, items: [] };
    } catch (error: any) {
        console.error("Failed to fetch wishlist from cloud", error);
        return { success: false, error: error.message, items: [] };
    }
}
