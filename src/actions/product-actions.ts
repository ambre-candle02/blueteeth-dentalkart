"use server";

import { db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    price: z.coerce.number().min(0, "Price must be positive"),
    description: z.string().optional(),
    category: z.string().optional(),
}).passthrough();

import { auth } from "@/auth";

async function verifyAdmin() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        throw new Error("Unauthorized Access: Admin privileges required.");
    }
}

export async function createProduct(formData: any) {
    try {
        await verifyAdmin();
        const parsed = productSchema.safeParse(formData);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
        }

        const docRef = await db.collection('products').add({
            ...parsed.data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        revalidatePath("/admin/products");
        revalidatePath("/shop");
        return { success: true, id: docRef.id };
    } catch (error: any) {
        console.error("Create Product Error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateProduct(id: string, formData: any) {
    try {
        await verifyAdmin();
        const parsed = productSchema.partial().safeParse(formData);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
        }

        // Handle Image Deletion for overwritten/removed images
        const docRef = db.collection('products').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
            const productData = doc.data();
            const oldImages = productData?.images || [];
            const newImages = formData.images || [];

            // Find URLs that exist in oldImages but not in newImages
            const newImageUrls = newImages.map((img: any) => img.url).filter(Boolean);
            const removedImages = oldImages.filter((oldImg: any) => oldImg.url && !newImageUrls.includes(oldImg.url));

            // Delete removed images from Cloudinary
            for (const img of removedImages) {
                if (img.url.includes('res.cloudinary.com')) {
                    await deleteImageFromCloudinary(img.url);
                }
            }
        }

        await docRef.update({
            ...parsed.data,
            updatedAt: new Date().toISOString(),
            images: formData.images, // Ensuring Images get properly updated
            image: formData.image // Ensuring Primary image gets properly updated
        });

        revalidatePath("/admin/products");
        revalidatePath(`/product/${id}`);
        revalidatePath("/shop");
        revalidatePath("/cart");
        return { success: true };
    } catch (error: any) {
        console.error("Update Product Error:", error);
        return { success: false, error: error.message };
    }
}

import { deleteImageFromCloudinary } from "@/actions/upload-actions";

export async function deleteProduct(id: string) {
    try {
        await verifyAdmin();
        const docRef = db.collection('products').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
            const productData = doc.data();
            if (productData?.images && Array.isArray(productData.images)) {
                for (const img of productData.images) {
                    if (img.url && img.url.includes('res.cloudinary.com')) {
                        await deleteImageFromCloudinary(img.url);
                    }
                }
            } else if (productData?.image && productData.image.includes('res.cloudinary.com')) {
                await deleteImageFromCloudinary(productData.image);
            }
        }

        await docRef.delete();
        revalidatePath("/admin/products");
        revalidatePath("/shop");
        return { success: true };
    } catch (error: any) {
        console.error("Delete Product Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getProducts() {
    try {
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return { success: true, products: [] };
        }

        const products = snapshot.docs.map(doc => ({
            _id: doc.id,
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, products: JSON.parse(JSON.stringify(products)) };
    } catch (error: any) {
        console.error("Get Products Error:", error);
        return { success: false, error: error.message };
    }
}

import { PRODUCTS } from "@/lib/data";

export async function getProductById(id: string) {
    try {
        const doc = await db.collection('products').doc(id).get();
        if (!doc.exists) {
            // Fallback to check static products
            const staticProduct = PRODUCTS.find(p => p.id === id);
            if (staticProduct) {
                return { success: true, product: staticProduct };
            }
            return { success: false, error: "Product not found" };
        }

        const product = {
            _id: doc.id,
            id: doc.id,
            ...doc.data()
        };

        return { success: true, product: JSON.parse(JSON.stringify(product)) };
    } catch (error: any) {
        console.error("Get Product By ID Error:", error);
        return { success: false, error: error.message };
    }
}
