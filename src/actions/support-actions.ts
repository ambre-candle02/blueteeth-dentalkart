'use server';

import { db } from '@/lib/firebase-admin';
import { auth } from '@/auth';
import { sendSupportNotification, sendClinicSetupNotification } from '@/lib/email';
import { z } from 'zod';

export async function submitClinicSetup(formData: any, setupDetails: any) {
    try {
        const session = await auth();
        const setupRef = db.collection('clinic_setup_requests');

        const newRequest = {
            ...formData,
            ...setupDetails,
            userId: session?.user?.id || 'anonymous',
            userEmail: session?.user?.email || 'N/A',
            status: 'new',
            createdAt: new Date().toISOString(),
        };

        const docRef = await setupRef.add(newRequest);

        // Notify Admin via Email
        await sendClinicSetupNotification(formData, setupDetails);

        return { success: true, requestId: docRef.id };
    } catch (error: any) {
        console.error('Clinic Setup Submission Failed:', error);
        return { success: false, error: error.message };
    }
}

const supportSchema = z.object({
    firstName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message is too short"),
});

export async function submitSupportRequest(formData: {
    firstName: string;
    email: string;
    message: string;
}) {
    try {
        const parsed = supportSchema.safeParse(formData);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0].message };
        }

        const session = await auth();
        const supportRef = db.collection('support_tickets');

        const newTicket = {
            ...formData,
            userId: session?.user?.id || 'anonymous',
            status: 'open',
            priority: 'medium',
            createdAt: new Date().toISOString(),
            metadata: {
                userAgent: 'Web Terminal v1.0',
                source: 'Contact Page'
            }
        };

        const docRef = await supportRef.add(newTicket);

        // Send Email to Admin
        await sendSupportNotification(parsed.data, docRef.id);

        return { success: true, ticketId: docRef.id };
    } catch (error: any) {
        console.error('Support Transmission Failed:', error);
        return { success: false, error: error.message };
    }
}
