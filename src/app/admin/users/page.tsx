import { ShieldCheck, Mail, Calendar, UserCog } from "lucide-react";
import { getUsers } from "@/actions/auth-actions";
import { DeleteUserButton } from "./DeleteUserButton";
import { ToggleRoleButton } from "./ToggleRoleButton";

export default async function AdminUsersPage() {
    const { users = [] } = await getUsers();

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">User Management</h1>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest opacity-60 italic">Manage registered professionals and administrative access.</p>
                </div>
                <div className="bg-blue-100/40 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-4 border border-blue-200/50 shadow-sm w-fit">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <UserCog size={18} className="sm:size-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-xs sm:text-[14px] leading-none tabular-nums">{users.length}</span>
                        <span className="text-[8px] sm:text-[9px] font-black text-blue-600 uppercase tracking-[0.1em] opacity-80 mt-1 italic">Total Registry</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-blue-200/40 shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-blue-50/50 border-b border-blue-100/50">
                            {/* User — always visible */}
                            <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] italic">User</th>
                            {/* Email — desktop only */}
                            <th className="hidden sm:table-cell px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] italic">Email</th>
                            {/* Role — desktop only (shown in User cell on mobile) */}
                            <th className="hidden sm:table-cell px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] italic">Role</th>
                            {/* Joined — large screens only */}
                            <th className="hidden md:table-cell px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] italic">Joined</th>
                            {/* Actions — always visible, right-aligned, nowrap */}
                            <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic text-right whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100/30">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100 shadow-inner">
                                            <UserCog size={30} />
                                        </div>
                                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.4em] italic opacity-70">No users found.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">

                                    {/* ── USER CELL (always visible) ─────── */}
                                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                                        <div className="flex items-center gap-2 sm:gap-5">
                                            {/* Avatar */}
                                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-blue-100 shadow-md flex items-center justify-center font-black text-blue-600 shrink-0 text-sm">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            {/* Name + sub-info */}
                                            <div className="min-w-0">
                                                <p className="font-black text-slate-900 text-xs sm:text-[14px] tracking-tighter truncate max-w-[90px] sm:max-w-[200px]">
                                                    {user.name || 'Unnamed'}
                                                </p>
                                                <p className="text-[7px] sm:text-[9px] text-slate-400 font-black uppercase tracking-widest opacity-60">
                                                    #{(user.id || '').substring(0, 6).toUpperCase()}
                                                </p>
                                                {/* Mobile-only: email */}
                                                <p className="sm:hidden text-[7px] text-slate-400 font-bold truncate max-w-[90px] mt-0.5 opacity-70">
                                                    {user.email || ''}
                                                </p>
                                                {/* Mobile-only: role badge under name */}
                                                <div className="sm:hidden mt-1">
                                                    {user.role === 'ADMIN' ? (
                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[6px] font-black bg-purple-500 text-white border border-purple-400 uppercase tracking-wider italic">
                                                            <ShieldCheck size={7} strokeWidth={3} /> Admin
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[6px] font-black bg-blue-100/60 text-blue-600 border border-blue-200/50 uppercase tracking-wider italic">
                                                            User
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* ── EMAIL (desktop only) ────────────── */}
                                    <td className="hidden sm:table-cell px-8 py-6">
                                        {user.email && (
                                            <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-slate-600 font-black tracking-tight group-hover:text-blue-600 transition-colors truncate max-w-[180px]">
                                                <Mail size={13} className="text-blue-400/50 group-hover:text-blue-500 shrink-0" />
                                                {user.email}
                                            </div>
                                        )}
                                    </td>

                                    {/* ── ROLE (desktop only) ─────────────── */}
                                    <td className="hidden sm:table-cell px-8 py-6">
                                        {user.role === 'ADMIN' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[8px] font-black bg-purple-500 text-white border border-purple-400 uppercase tracking-widest shadow-lg shadow-purple-500/20 italic whitespace-nowrap">
                                                <ShieldCheck size={9} strokeWidth={3} /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-xl text-[8px] font-black bg-blue-100/50 text-blue-600 border border-blue-200/50 uppercase tracking-widest italic whitespace-nowrap">
                                                User
                                            </span>
                                        )}
                                    </td>

                                    {/* ── JOINED (large screens only) ─────── */}
                                    <td className="hidden md:table-cell px-8 py-6 text-sm">
                                        <div className="flex items-center gap-2 text-[11px] font-black text-slate-500/70 tracking-tighter tabular-nums">
                                            <Calendar size={12} className="text-blue-400/50" />
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                        </div>
                                    </td>

                                    {/* ── ACTIONS (always visible) ─────────── */}
                                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-right">
                                        <div className="flex items-center justify-end gap-1.5 sm:gap-3">
                                            <ToggleRoleButton userId={user.id} currentRole={user.role} />
                                            {user.role !== 'ADMIN' && (
                                                <DeleteUserButton userId={user.id} />
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
