'use server';

import { db } from '@/lib/firebase-admin';
import { auth } from '@/auth';
import { unstable_noStore as noStore } from 'next/cache';
import { sendAdminOrderNotification, sendAdminWhatsAppNotification } from '@/lib/email';
import { z } from 'zod';
import { PRODUCTS } from '@/lib/data';

const orderSchema = z.object({
    items: z.array(z.any()).min(1, "Order must contain at least one item"),
    totalAmount: z.coerce.number().min(0, "Total amount must be non-negative"),
}).passthrough();

import Razorpay from 'razorpay';
import crypto from 'crypto';

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

export async function createRazorpayOrder(orderData: any) {
    try {
        const parsed = orderSchema.safeParse(orderData);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
        }

        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Authorization required for clinical transactions.' };
        }

        let secureCartSubtotal = 0;
        const validItems = [];

        for (const inputItem of parsed.data.items) {
            if (!inputItem.id || !inputItem.quantity || inputItem.quantity <= 0) continue;

            let realPrice = 0;
            const docRef = await db.collection('products').doc(inputItem.id).get();

            if (docRef.exists) {
                const data = docRef.data();
                realPrice = data?.price || 0;
                // STrict Stock Verification
                const stock = data?.stock || 0;
                if (stock < inputItem.quantity) {
                    return { success: false, error: `Not enough stock for ${data?.name || 'an item'}. Available: ${stock}` };
                }
            } else {
                const staticP = PRODUCTS.find(p => p.id === inputItem.id);
                if (staticP) realPrice = staticP.price;
            }

            if (realPrice > 0) {
                secureCartSubtotal += realPrice * inputItem.quantity;
                validItems.push({
                    ...inputItem,
                    price: realPrice
                });
            }
        }

        if (validItems.length === 0) {
            return { success: false, error: 'Cannot process order. Items are invalid or missing.' };
        }

        const gstCount = secureCartSubtotal * 0.18;
        const secureTotalAmount = secureCartSubtotal + gstCount;

        const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy';
        const key_secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

        const razorpay = new Razorpay({ key_id, key_secret });

        const options = {
            amount: Math.round(secureTotalAmount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        let orderId = `dummy_order_${Date.now()}`;
        let amount = Math.round(secureTotalAmount * 100);

        // Try creating actual order if real credentials exist
        if (key_id !== 'rzp_test_dummy') {
            const rzpOrder = await razorpay.orders.create(options);
            orderId = rzpOrder.id;
        }

        // Pre-create the order in firebase with PENDING status
        const ordersRef = db.collection('orders');
        const newOrder = {
            ...parsed.data,
            items: validItems,
            totalAmount: secureTotalAmount,
            userId: session.user.id,
            status: 'Processing',
            statusStep: 1,
            paymentStatus: 'Pending',
            paymentMethod: 'Online',
            razorpayOrderId: orderId,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            createdAt: new Date().toISOString(),
            protocolId: `BT-${Math.floor(100000 + Math.random() * 900000)}`
        };

        const docRef = await ordersRef.add(newOrder);

        return {
            success: true,
            razorpayOrderId: orderId,
            amount: amount,
            dbOrderId: docRef.id,
            key: key_id
        };
    } catch (error: any) {
        console.error('Razorpay Error:', error);
        return { success: false, error: error.message };
    }
}

export async function verifyAndPlaceOrder(dbOrderId: string, paymentResponse: any, orderData: any) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResponse;
        const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

        // Actual Verification 
        if (secret !== 'dummy_secret' && razorpay_signature) {
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
            const generatedSignature = hmac.digest('hex');

            if (generatedSignature !== razorpay_signature) {
                return { success: false, error: 'Payment signature verification failed' };
            }
        }

        // Update DB
        const docRef = db.collection('orders').doc(dbOrderId);
        await docRef.update({
            paymentStatus: 'Paid',
            razorpayPaymentId: razorpay_payment_id || 'dummy_payment',
            paymentVerifiedAt: new Date().toISOString()
        });

        // Deduct Stock
        if (orderData?.items) {
            await decrementProductStock(orderData.items);
        }

        // Notify Admin
        Promise.all([
            sendAdminOrderNotification(orderData, dbOrderId),
            sendAdminWhatsAppNotification(orderData, dbOrderId)
        ]).catch(err => console.error("Notification error:", err));

        return { success: true, orderId: dbOrderId };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


export async function placeOrder(orderData: any) {
    try {
        const parsed = orderSchema.safeParse(orderData);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
        }

        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Authorization required for clinical transactions.' };
        }

        let secureCartSubtotal = 0;
        const validItems = [];

        for (const inputItem of parsed.data.items) {
            if (!inputItem.id || !inputItem.quantity || inputItem.quantity <= 0) continue;

            let realPrice = 0;
            const docRef = await db.collection('products').doc(inputItem.id).get();

            if (docRef.exists) {
                const data = docRef.data();
                realPrice = data?.price || 0;

                // Strict Stock Verification
                const stock = data?.stock || 0;
                if (stock < inputItem.quantity) {
                    return { success: false, error: `Not enough stock for ${data?.name || 'an item'}. Available: ${stock}` };
                }
            } else {
                const staticP = PRODUCTS.find(p => p.id === inputItem.id);
                if (staticP) realPrice = staticP.price;
            }

            if (realPrice > 0) {
                secureCartSubtotal += realPrice * inputItem.quantity;
                validItems.push({
                    ...inputItem,
                    price: realPrice
                });
            }
        }

        if (validItems.length === 0) {
            return { success: false, error: 'Cannot process order. Items are invalid or missing.' };
        }

        const gstCount = secureCartSubtotal * 0.18;
        const secureTotalAmount = secureCartSubtotal + gstCount;

        const ordersRef = db.collection('orders');

        const newOrder = {
            ...parsed.data,
            items: validItems,
            totalAmount: secureTotalAmount,
            userId: session.user.id,
            status: 'Processing',
            statusStep: 1,
            paymentStatus: 'Paid',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            createdAt: new Date().toISOString(),
            protocolId: `BT-${Math.floor(100000 + Math.random() * 900000)}`
        };

        const docRef = await ordersRef.add(newOrder);

        // Deduct Stock
        await decrementProductStock(validItems);

        // Notify the Admin/Godown Management async to avoid blocking
        Promise.all([
            sendAdminOrderNotification(orderData, docRef.id),
            sendAdminWhatsAppNotification(orderData, docRef.id)
        ]).catch(err => console.error("Notification trigger error:", err));

        return { success: true, orderId: docRef.id };
    } catch (error: any) {
        console.error('Order Placement Failed:', error);
        return { success: false, error: error.message };
    }
}

export async function getUserOrders() {
    noStore();
    try {
        const session = await auth();
        if (!session?.user?.id) return [];

        const ordersRef = db.collection('orders');
        const snapshot = await ordersRef
            .where('userId', '==', session.user.id)
            .get();

        if (snapshot.empty) return [];

        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort descending in memory to avoid missing Firebase Index errors
        return orders
            .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 20);
    } catch (error) {
        console.error('Failed to fetch user orders:', error);
        return [];
    }
}

export async function getOrderById(orderId: string) {
    noStore();
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const docRef = await db.collection('orders').doc(orderId).get();
        if (!docRef.exists) return null;

        const data = docRef.data();
        // Simple security check so users can't see others' orders
        if (data?.userId !== session.user.id) return null;

        return { id: docRef.id, ...data };
    } catch (error) {
        console.error('Failed to fetch order details:', error);
        return null;
    }
}
