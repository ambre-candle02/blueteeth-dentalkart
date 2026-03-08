'use server';

import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export interface GlobalConfig {
    maintenanceMode: boolean;
    shopAnnouncement: string;
    maxCartItems: number;
    showStockLevel: boolean;
    lastUpdated: number;
}

const DEFAULT_CONFIG: GlobalConfig = {
    maintenanceMode: false,
    shopAnnouncement: "Welcome to Blueteeth Dental Store!",
    maxCartItems: 10,
    showStockLevel: true,
    lastUpdated: Date.now()
};

const CONFIG_DOC_ID = 'global_settings';

export async function getGlobalConfig(): Promise<GlobalConfig> {
    try {
        const doc = await db.collection('admin_configs').doc(CONFIG_DOC_ID).get();
        if (!doc.exists) {
            return DEFAULT_CONFIG;
        }
        return doc.data() as GlobalConfig;
    } catch (error) {
        console.error("Error fetching global config:", error);
        return DEFAULT_CONFIG;
    }
}

export async function updateGlobalConfig(config: Partial<GlobalConfig>) {
    try {
        const adminRef = db.collection('admin_configs').doc(CONFIG_DOC_ID);
        await adminRef.set({
            ...config,
            lastUpdated: Date.now()
        }, { merge: true });

        revalidatePath('/admin/settings');
        revalidatePath('/cart');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating global config:", error);
        return { success: false, error: error.message };
    }
}
