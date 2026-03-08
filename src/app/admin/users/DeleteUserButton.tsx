"use client";

import { Trash2, Loader2 } from "lucide-react";
import { deleteUser } from "@/actions/auth-actions";
import { toast } from "sonner";
import { useState } from "react";

export function DeleteUserButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

        setLoading(true);
        const result = await deleteUser(userId);

        if (result.success) {
            toast.success("User deleted successfully.");
        } else {
            toast.error("Failed to delete user: " + result.error);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="relative p-2.5 rounded-xl transition-all shadow-md border backdrop-blur-md bg-gradient-to-br from-rose-400/25 to-red-400/20 text-rose-600 border-rose-300/50 hover:from-rose-400/45 hover:to-red-400/35 hover:shadow-rose-100 shadow-rose-100/50 disabled:opacity-50"
            title="Delete User"
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Trash2 size={16} />
            )}
        </button>
    );
}
