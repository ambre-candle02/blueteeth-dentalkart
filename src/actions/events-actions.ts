'use server';

import { db } from '@/lib/firebase-admin';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
}

export interface EventData {
    id?: string;
    title: string;
    date: string;
    type: string;
    status: 'Upcoming' | 'Active' | 'Draft' | 'Completed';
    attendees: number;
    location?: string;
    description?: string;
    createdAt?: string;
}

export async function getEvents() {
    try {
        await verifyAdmin();
        const snap = await db.collection('events').orderBy('date', 'desc').get();
        const events = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, events: JSON.parse(JSON.stringify(events)) };
    } catch (error: any) {
        return { success: false, error: error.message, events: [] };
    }
}

export async function saveEvent(data: EventData) {
    try {
        await verifyAdmin();
        const payload = {
            title: data.title,
            date: data.date,
            type: data.type,
            status: data.status,
            attendees: Number(data.attendees) || 0,
            location: data.location || '',
            description: data.description || '',
            updatedAt: new Date().toISOString(),
        };
        if (data.id) {
            await db.collection('events').doc(data.id).update(payload);
        } else {
            await db.collection('events').doc().set({ ...payload, createdAt: new Date().toISOString() });
        }
        revalidatePath('/admin/events');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteEvent(id: string) {
    try {
        await verifyAdmin();
        await db.collection('events').doc(id).delete();
        revalidatePath('/admin/events');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
