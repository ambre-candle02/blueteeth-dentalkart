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
        } catch (err) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`p-2 rounded-xl transition-all ${currentRole === 'ADMIN'
                    ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                }`}
            title={currentRole === 'ADMIN' ? "Revoke Admin Access" : "Grant Admin Access"}
        >
            {isPending ? (
                <Loader2 size={18} className="animate-spin" />
            ) : currentRole === 'ADMIN' ? (
                <ShieldAlert size={18} />
            ) : (
                <ShieldCheck size={18} />
            )}
        </button>
    );
}
