"use server";

import { db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/actions/upload-actions";
import { auth } from "@/auth";

async function verifyAdmin() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        throw new Error("Unauthorized Access: Admin privileges required.");
    }
}

export async function saveMediaRecord(url: string, publicId: string) {
    try {
        await verifyAdmin();
        const docRef = await db.collection("media").add({
            url,
            publicId,
            createdAt: new Date().toISOString()
        });

        revalidatePath("/admin/gallery");
        return { success: true, id: docRef.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getMedia() {
    try {
        await verifyAdmin();
        const snapshot = await db.collection("media").orderBy("createdAt", "desc").get();
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, items: JSON.parse(JSON.stringify(items)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteMedia(id: string, url: string) {
    try {
        await verifyAdmin();
        await deleteImageFromCloudinary(url);
        await db.collection("media").doc(id).delete();
        revalidatePath("/admin/gallery");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
