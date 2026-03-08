"use client";

import { useState } from "react";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { toggleUserRole } from "@/actions/auth-actions";
import { toast } from "sonner";

export function ToggleRoleButton({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [isPending, setIsPending] = useState(false);

    const handleToggle = async () => {
        if (!confirm(`Are you sure you want to change this user's role to ${currentRole === 'ADMIN' ? 'Professional' : 'Administrator'}?`)) return;

        setIsPending(true);
        try {
            const result = await toggleUserRole(userId, currentRole);
            if (result.success) {
                toast.success(`User role updated to ${result.newRole}`);
            } else {
                toast.error(result.error || "Failed to update role");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`relative p-2.5 rounded-xl transition-all shadow-md border backdrop-blur-md disabled:opacity-50 ${currentRole === 'ADMIN'
                    ? 'bg-gradient-to-br from-amber-400/30 to-orange-400/20 text-amber-600 border-amber-300/50 hover:from-amber-400/50 hover:to-orange-400/40 hover:shadow-amber-200 shadow-amber-100/60'
                    : 'bg-gradient-to-br from-cyan-400/25 to-teal-400/20 text-teal-600 border-teal-300/50 hover:from-cyan-400/45 hover:to-teal-400/35 hover:shadow-teal-100 shadow-teal-100/50'
                }`}
            title={currentRole === 'ADMIN' ? "Revoke Admin — Make User" : "Grant Admin Access"}
        >
            {isPending ? (
                <Loader2 size={16} className="animate-spin" />
            ) : currentRole === 'ADMIN' ? (
                <ShieldAlert size={16} />
            ) : (
                <ShieldCheck size={16} />
            )}
        </button>
    );
}
