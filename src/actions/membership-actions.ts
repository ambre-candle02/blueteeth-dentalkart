"use server";

import { db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { sendMembershipUpgradeNotification } from "@/lib/email";

export interface MembershipPlan {
    id: string;
    name: string;
    price: number;
    period: string;
    desc: string;
    features: string[];
    icon: string;
    color: string;
    highlight: boolean;
}

export async function getMembershipPlans() {
    try {
        const snapshot = await db.collection("membership_plans").get();
        const plans = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as MembershipPlan[];

        return { success: true, plans };
    } catch (error: any) {
        console.error("Error fetching membership plans:", error);
        return { success: false, error: error.message };
    }
}

export async function saveMembershipPlan(plan: Partial<MembershipPlan>) {
    try {
        if (plan.id) {
            const planId = plan.id;
            const planData = { ...plan };
            delete planData.id;
            await db.collection("membership_plans").doc(planId).set(planData, { merge: true });
        } else {
            await db.collection("membership_plans").add(plan);
        }
        revalidatePath("/admin/membership");
        revalidatePath("/membership");
        return { success: true };
    } catch (error: any) {
        console.error("Error saving membership plan:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteMembershipPlan(id: string) {
    try {
        await db.collection("membership_plans").doc(id).delete();
        revalidatePath("/admin/membership");
        revalidatePath("/membership");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting membership plan:", error);
        return { success: false, error: error.message };
    }
}

export async function seedInitialPlans() {
    const initialPlans = [
        {
            name: "Clinical Lite",
            price: 0,
            period: "",
            desc: "Essential procurement for growing clinics",
            features: ["Standard Logistics", "Portal Access", "B2B Invoicing", "Monthly Statements"],
            icon: "Building2",
            color: "slate",
            highlight: false,
        },
        {
            name: "Elite Partner",
            price: 4999,
            period: "/year",
            desc: "Advanced logistics & dedicated support",
            features: ["5% Equipment Rebate", "Priority Handling", "24/7 Phone Desk", "Extended Warranty", "VIP Procurement Access"],
            icon: "TrendingUp",
            color: "amber",
            highlight: true,
        },
        {
            name: "Surgical Platinum",
            price: 9999,
            period: "/year",
            desc: "The ultimate clinical supply chain solution",
            features: ["10% Marketplace Discount", "Next-Day Delivery", "Dedicated Manager", "Equipment Calibration", "Global Seminar Invites"],
            icon: "Handshake",
            color: "indigo",
            highlight: false,
        },
    ];

    try {
        const batch = db.batch();
        const collection = db.collection("membership_plans");

        // Clear existing first? Optional.

        for (const plan of initialPlans) {
            const docRef = collection.doc();
            batch.set(docRef, plan);
        }

        await batch.commit();
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function requestMembershipUpgrade(userData: { name: string, email: string }, plan: any) {
    try {
        await sendMembershipUpgradeNotification(userData, plan);
        return { success: true };
    } catch (error: any) {
        console.error("Upgrade Request Logged ERROR:", error);
        return { success: false, error: error.message };
    }
}
