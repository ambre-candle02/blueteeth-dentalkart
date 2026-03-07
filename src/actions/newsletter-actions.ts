"use server";

import { db } from "@/lib/firebase-admin";

export async function subscribeNewsletter(email: string) {
    try {
        if (!email) return { success: false, error: "Email is required." };

        const subsRef = db.collection('newsletter_subscriptions');

        // Check if already subscribed (optional, but good)
        const snapshot = await subsRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            return { success: true, message: "Already subscribed! Premium protocols are active." };
        }

        await subsRef.add({
            email,
            subscribedAt: new Date().toISOString(),
            status: 'active'
        });

        return { success: true };
    } catch (error: any) {
        console.error('Newsletter Subscription Failed:', error);
        return { success: false, error: error.message };
    }
}
