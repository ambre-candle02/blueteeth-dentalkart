"use server";

import { db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

async function verifyAdmin() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        throw new Error("Unauthorized Access: Admin privileges required.");
    }
}

export async function getOrders() {
    try {
        await verifyAdmin();
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return { success: true, orders: [] };
        }

        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            _id: doc.id,
            ...doc.data()
        }));

        return { success: true, orders: JSON.parse(JSON.stringify(orders)) };
    } catch (error: any) {
        console.error("Get Orders Error:", error);
        return { success: false, error: error.message };
    }
}

async function incrementProductStock(items: any[]) {
    try {
        for (const item of items) {
            const docRef = db.collection('products').doc(item.id);
            const doc = await docRef.get();
            if (doc.exists) {
                const currentStock = doc.data()?.stock || 0;
                await docRef.update({ stock: currentStock + item.quantity });
            }
        }
    } catch (err) {
        console.error("Partial stock restoration failure:", err);
    }
}

async function decrementProductStock(items: any[]) {
    try {
        for (const item of items) {
            const docRef = db.collection('products').doc(item.id);
            const doc = await docRef.get();
            if (doc.exists) {
                const currentStock = doc.data()?.stock || 0;
                await docRef.update({ stock: Math.max(0, currentStock - item.quantity) });
            }
        }
    } catch (err) {
        console.error("Partial stock deduction failure:", err);
    }
}

export async function updateOrderStatus(id: string, status: string) {
    try {
        await verifyAdmin();
        const docRef = db.collection('orders').doc(id);
        const orderDoc = await docRef.get();
        if (!orderDoc.exists) throw new Error("Order not found");

        const orderData = orderDoc.data();
        const oldStatus = orderData?.status;

        await docRef.update({
            status,
            updatedAt: new Date().toISOString()
        });

        if (status === 'cancelled' && oldStatus !== 'cancelled' && orderData?.items) {
            await incrementProductStock(orderData.items);
        } else if (oldStatus === 'cancelled' && status !== 'cancelled' && orderData?.items) {
            await decrementProductStock(orderData.items);
        }

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error: any) {
        console.error("Update Order Status Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getOrderDetails(id: string) {
    try {
        await verifyAdmin();
        const doc = await db.collection('orders').doc(id).get();
        if (!doc.exists) return { success: false, error: "Order not found" };

        const order = {
            id: doc.id,
            _id: doc.id,
            ...doc.data()
        };

        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error: any) {
        console.error("Get Order Details Error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteOrder(id: string) {
    try {
        await verifyAdmin();
        const docRef = db.collection('orders').doc(id);
        const orderDoc = await docRef.get();

        if (orderDoc.exists) {
            const orderData = orderDoc.data();
            if (orderData?.status !== 'cancelled' && orderData?.items) {
                await incrementProductStock(orderData.items);
            }
        }

        await docRef.delete();
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error: any) {
        console.error("Delete Order Error:", error);
        return { success: false, error: error.message };
    }
}
