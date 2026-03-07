"use client";

import { Trash2 } from "lucide-react";
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
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:shadow-md border border-transparent hover:border-red-100 disabled:opacity-50"
            title="Delete User"
        >
            <Trash2 size={18} />
        </button>
    );
}
