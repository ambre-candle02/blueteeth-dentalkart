'use server';

import { db } from "@/lib/firebase-admin";

export async function getUsersCount() {
    try {
        const snapshot = await db.collection('users').count().get();
        return { success: true, count: snapshot.data().count };
    } catch (error: any) {
        console.error("Get Users Count Error:", error);
        return { success: false, error: error.message, count: 0 };
    }
}
