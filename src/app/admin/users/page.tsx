import { ShieldCheck, Mail, Calendar, UserCog } from "lucide-react";
import { getUsers } from "@/actions/auth-actions";
import { DeleteUserButton } from "./DeleteUserButton";
import { ToggleRoleButton } from "./ToggleRoleButton";

export default async function AdminUsersPage() {
    const { users = [] } = await getUsers();

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">User Management</h1>
                    <p className="text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest opacity-60 italic">Manage registered professionals and administrative access.</p>
                </div>
                <div className="bg-blue-100/40 backdrop-blur-md px-8 py-4 rounded-2xl flex items-center gap-4 border border-blue-200/50 shadow-sm">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <UserCog size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-[14px] leading-none tabular-nums">{users.length}</span>
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.1em] opacity-80 mt-1 italic">Total Registry</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-blue-200/40 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-50/50 border-b border-blue-100/50">
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] italic">User Profile</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] italic">Contact Matrix</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] italic">Access Tier</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] italic">Join Protocol</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] italic text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100/30">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100 shadow-inner">
                                                <UserCog size={36} />
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.4em] italic opacity-70">No synchronized entries found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-white border border-blue-100 shadow-md flex items-center justify-center font-black text-blue-600 shrink-0 group-hover:scale-110 transition-all">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div className="min-w-0 space-y-1">
                                                    <p className="font-black text-slate-900 text-[14px] tracking-tighter truncate max-w-[200px]">{user.name || 'Unnamed Professional'}</p>
                                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest opacity-60">ID: {(user.id || '').substring(0, 8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.email && (
                                                <div className="flex items-center gap-3 text-[12px] text-slate-600 font-black tracking-tight group-hover:text-blue-600 transition-colors">
                                                    <Mail size={16} className="text-blue-400/50 group-hover:text-blue-500" />
                                                    {user.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.role === 'ADMIN' ? (
                                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[9px] font-black bg-purple-500 text-white border border-purple-400 uppercase tracking-widest shadow-lg shadow-purple-500/20 italic">
                                                    <ShieldCheck size={12} strokeWidth={3} /> Administrator
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[9px] font-black bg-blue-100/50 text-blue-600 border border-blue-200/50 uppercase tracking-widest italic">
                                                    Professional
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <div className="flex items-center gap-2.5 text-[11px] font-black text-slate-500/70 tracking-tighter tabular-nums">
                                                <Calendar size={14} className="text-blue-400/50" />
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-12 group-hover:translate-x-0">
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
        </div>
    );
}

