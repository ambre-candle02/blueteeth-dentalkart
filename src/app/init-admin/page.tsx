import { redirect } from "next/navigation";
import { auth } from "@/auth";

// This page is disabled for security. Use the DB directly to create first admin.
export default async function AdminSetupPage() {
    // If already an admin is logged in, redirect to admin panel
    const session = await auth();
    if (session?.user && (session.user as any).role === "ADMIN") {
        redirect("/admin");
    }
    // Redirect everyone else to login — this page is not publicly usable
    redirect("/login");
}
