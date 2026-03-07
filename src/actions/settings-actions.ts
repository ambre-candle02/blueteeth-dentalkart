'use server';

import { db } from '@/lib/firebase-admin';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const profileSchema = z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    phone: z.string().regex(/^[0-9+() -]*$/, "Invalid phone format").min(10, "Phone number too short"),
    profileImage: z.string().optional()
});

const addressSchema = z.object({
    facilityName: z.string().min(2, "Facility name is required"),
    completeAddress: z.string().min(5, "Complete address is required"),
    city: z.string().min(2, "City is required"),
    pincode: z.string().min(6, "Valid 6-digit pincode is required"),
});

// Data types 
export interface AddressConfig {
    id: string;
    facilityName: string;
    completeAddress: string;
    city: string;
    pincode: string;
    isPrimary: boolean;
    createdAt: number;
}

export interface UserSettings {
    profile: {
        firstName: string;
        lastName: string;
        phone: string;
        profileImage?: string;
    };
    addresses: AddressConfig[];
    notifications: {
        orderStatus: boolean;
        promotions: boolean;
        restocks: boolean;
        securityAlerts: boolean; // always true ideally
    };
    payments?: any[]; // Placeholder for payment endpoints
}

async function getUserEmailAndId() {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
        throw new Error("Unauthorized");
    }
    return { email: session.user.email, id: session.user.id || session.user.email };
}

// ============================================
// PROFILE ACTIONS
// ============================================
export async function updateProfileSettings(firstName: string, lastName: string, phone: string, profileImage?: string) {
    try {
        const parsed = profileSchema.safeParse({ firstName, lastName, phone, profileImage });
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0].message };
        }

        const { email } = await getUserEmailAndId();

        const userRef = db.collection('settings').doc(email);

        await userRef.set({
            profile: parsed.data
        }, { merge: true });

        revalidatePath('/settings');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }
}


// ============================================
// ADDRESS ACTIONS
// ============================================
export async function addAddressRoute(addressData: Omit<AddressConfig, 'id' | 'createdAt' | 'isPrimary'>) {
    try {
        const parsed = addressSchema.safeParse(addressData);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0].message };
        }

        const { email } = await getUserEmailAndId();
        const userRef = db.collection('settings').doc(email);

        // Fetch existing addresses
        const doc = await userRef.get();
        const currentData = doc.data();
        const existingAddresses: AddressConfig[] = currentData?.addresses || [];

        const isFirstAddress = existingAddresses.length === 0;

        const newAddress: AddressConfig = {
            id: `route_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            ...addressData,
            isPrimary: isFirstAddress,
            createdAt: Date.now()
        };

        const updatedAddresses = [...existingAddresses, newAddress];

        await userRef.set({
            addresses: updatedAddresses
        }, { merge: true });

        revalidatePath('/settings');
        return { success: true, newAddress };
    } catch (error: any) {
        console.error("Error adding address:", error);
        return { success: false, error: error.message };
    }
}

export async function setPrimaryAddress(addressId: string) {
    try {
        const { email } = await getUserEmailAndId();
        const userRef = db.collection('settings').doc(email);

        const doc = await userRef.get();
        if (!doc.exists) throw new Error("Settings not found");

        const existingAddresses: AddressConfig[] = doc.data()?.addresses || [];

        const updatedAddresses = existingAddresses.map(addr => ({
            ...addr,
            isPrimary: addr.id === addressId
        }));

        await userRef.set({ addresses: updatedAddresses }, { merge: true });

        revalidatePath('/settings');
        return { success: true };
    } catch (error: any) {
        console.error("Error setting primary address:", error);
        return { success: false, error: error.message };
    }
}

export async function updateAddress(addressId: string, addressData: Omit<AddressConfig, 'id' | 'createdAt' | 'isPrimary'>) {
    try {
        const parsed = addressSchema.safeParse(addressData);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0].message };
        }

        const { email } = await getUserEmailAndId();
        const userRef = db.collection('settings').doc(email);

        const doc = await userRef.get();
        if (!doc.exists) throw new Error("Settings not found");

        const existingAddresses: AddressConfig[] = doc.data()?.addresses || [];

        const updatedAddresses = existingAddresses.map(addr =>
            addr.id === addressId
                ? { ...addr, ...parsed.data }
                : addr
        );

        await userRef.set({ addresses: updatedAddresses }, { merge: true });

        revalidatePath('/settings');
        return { success: true, updatedAddresses };
    } catch (error: any) {
        console.error("Error updating address:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteAddress(addressId: string) {
    try {
        const { email } = await getUserEmailAndId();
        const userRef = db.collection('settings').doc(email);

        const doc = await userRef.get();
        if (!doc.exists) throw new Error("Settings not found");

        const existingAddresses: AddressConfig[] = doc.data()?.addresses || [];
        const filtered = existingAddresses.filter(addr => addr.id !== addressId);

        // If we deleted the primary, make the first one primary
        if (filtered.length > 0 && !filtered.some(a => a.isPrimary)) {
            filtered[0].isPrimary = true;
        }

        await userRef.set({ addresses: filtered }, { merge: true });

        revalidatePath('/settings');
        return { success: true, updatedAddresses: filtered };
    } catch (error: any) {
        console.error("Error deleting address:", error);
        return { success: false, error: error.message };
    }
}



// ============================================
// NOTIFICATIONS ACTIONS
// ============================================
export async function updateNotificationPrefs(prefs: { orderStatus: boolean; promotions: boolean; restocks: boolean; securityAlerts?: boolean }) {
    try {
        const { email } = await getUserEmailAndId();
        const userRef = db.collection('settings').doc(email);

        await userRef.set({
            notifications: {
                ...prefs,
                securityAlerts: true // enforce security
            }
        }, { merge: true });

        revalidatePath('/settings');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating notifications:", error);
        return { success: false, error: error.message };
    }
}


// ============================================
// DATA FETCHING
// ============================================
export async function getUserSettings() {
    try {
        const { email } = await getUserEmailAndId();
        const userRef = db.collection('settings').doc(email);
        const doc = await userRef.get();

        if (!doc.exists) {
            return {
                profile: { firstName: '', lastName: '', phone: '', profileImage: '' },
                addresses: [],
                notifications: { orderStatus: true, promotions: false, restocks: true, securityAlerts: true }
            } as UserSettings;
        }

        return doc.data() as UserSettings;
    } catch (error: any) {
        console.error("Error fetching settings:", error);
        return null;
    }
}

// ============================================
// SECURITY ACTIONS
// ============================================
export async function updatePassword(currentPassword: string, newPassword: string) {
    try {
        const { email } = await getUserEmailAndId();
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return { success: false, error: "User identity not found" };
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        const passwordsMatch = await bcrypt.compare(currentPassword, userData.password);
        if (!passwordsMatch) {
            return { success: false, error: "Current authorization key is incorrect" };
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await userDoc.ref.update({
            password: hashedNewPassword,
            updatedAt: new Date().toISOString()
        });

        return { success: true };
    } catch (error: any) {
        console.error("Error updating password:", error);
        return { success: false, error: "Internal sequence error" };
    }
}
