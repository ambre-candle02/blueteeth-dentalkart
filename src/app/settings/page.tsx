'use client';

import { useSession, signOut } from "next-auth/react";
import { BackButton } from "@/components/ui/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Shield, Bell, MapPin, CreditCard, Save, Camera, ChevronRight, Key, Globe, LogOut, CheckCircle2, Loader2, UserCog, Truck, Wallet, ShieldCheck, BellRing } from "lucide-react";
import { getUserSettings, updateProfileSettings, addAddressRoute, updateAddress, deleteAddress, updateNotificationPrefs, updatePassword, AddressConfig } from "@/actions/settings-actions";
import { uploadImageToCloudinary } from "@/actions/upload-actions";
import { toast } from "sonner";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPath, setIsUploadingPath] = useState(false);
    const [isAddingRoute, setIsAddingRoute] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [editAddressForm, setEditAddressForm] = useState({ facilityName: '', completeAddress: '', city: '', pincode: '' });
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    // Store states
    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', phone: '', profileImage: '' });
    const [addresses, setAddresses] = useState<AddressConfig[]>([]);
    const [newAddressForm, setNewAddressForm] = useState({ facilityName: '', completeAddress: '', city: '', pincode: '' });
    const [passwordData, setPasswordData] = useState({ current: '', new: '' });

    const [notificationsPrefs, setNotificationsPrefs] = useState({
        orderStatus: true,
        promotions: false,
        restocks: true
    });

    const toggleNotification = async (key: keyof typeof notificationsPrefs) => {
        const newPrefs = { ...notificationsPrefs, [key]: !notificationsPrefs[key] };
        setNotificationsPrefs(newPrefs);

        // Auto save notifications immediately
        await updateNotificationPrefs(newPrefs);
    };

    // Load Data
    useEffect(() => {
        const loadInitData = async () => {
            const data = await getUserSettings();
            if (data) {
                setProfileData(prev => ({
                    ...prev,
                    ...data.profile,
                    // Fallback to session name if DB doesn't have it yet
                    firstName: data.profile?.firstName || session?.user?.name?.split(' ')[0] || '',
                    lastName: data.profile?.lastName || session?.user?.name?.split(' ').slice(1).join(' ') || '',
                }));
                setAddresses(data.addresses || []);
                if (data.notifications) {
                    setNotificationsPrefs({
                        ...notificationsPrefs,
                        orderStatus: data.notifications.orderStatus ?? true,
                        promotions: data.notifications.promotions ?? false,
                        restocks: data.notifications.restocks ?? true,
                    });
                }
            } else {
                // If no DB data, at least pre-fill from session
                setProfileData(prev => ({
                    ...prev,
                    firstName: session?.user?.name?.split(' ')[0] || '',
                    lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
                }));
            }
        };
        if (session?.user) loadInitData();
    }, [session]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const res = await updateProfileSettings(profileData.firstName, profileData.lastName, profileData.phone, profileData.profileImage);
        setIsSaving(false);
        if (res.success) {
            toast.success("Profile sync complete");
        } else {
            toast.error(res.error || "Sync failed");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingPath(true);
        const loadingToast = toast.loading("Uploading image...");

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'profiles');

        const uploadRes = await uploadImageToCloudinary(formData);

        if (uploadRes.success && uploadRes.url) {
            setProfileData(prev => ({ ...prev, profileImage: uploadRes.url }));
            toast.success("Profile photo updated!", { id: loadingToast });
        } else {
            toast.error(uploadRes.error || "Upload failed", { id: loadingToast });
        }
        setIsUploadingPath(false);
    };

    const handleSaveAddressRoute = async () => {
        if (!newAddressForm.facilityName || !newAddressForm.completeAddress) {
            toast.error("Facility name and Complete Address are required");
            return;
        }

        setIsSaving(true);
        const res = await addAddressRoute(newAddressForm);
        setIsSaving(false);

        if (res.success && res.newAddress) {
            toast.success("New Route Deployed");
            setAddresses([...addresses, res.newAddress]);
            setIsAddingRoute(false);
            setNewAddressForm({ facilityName: '', completeAddress: '', city: '', pincode: '' });
        } else {
            toast.error(res.error || "Deployment failed");
        }
    };

    const handleSavePassword = async () => {
        if (!passwordData.current || !passwordData.new) {
            toast.error("Both current and new passwords are required");
            return;
        }
        setIsSaving(true);
        const res = await updatePassword(passwordData.current, passwordData.new);
        setIsSaving(false);
        if (res.success) {
            toast.success("Security protocols updated");
            setPasswordData({ current: '', new: '' });
        } else {
            toast.error(res.error || "Failed to update security protocols");
        }
    };

    const handleEditAddress = (address: AddressConfig) => {
        setEditingAddressId(address.id);
        setEditAddressForm({
            facilityName: address.facilityName,
            completeAddress: address.completeAddress,
            city: address.city,
            pincode: address.pincode,
        });
    };

    const handleUpdateAddress = async () => {
        if (!editingAddressId) return;
        setIsSaving(true);
        const res = await updateAddress(editingAddressId, editAddressForm);
        setIsSaving(false);
        if (res.success && res.updatedAddresses) {
            toast.success("Route updated successfully");
            setAddresses(res.updatedAddresses);
            setEditingAddressId(null);
        } else {
            toast.error((res as any).error || "Update failed");
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm("Delete this address route?")) return;
        setIsDeletingId(addressId);
        const res = await deleteAddress(addressId);
        setIsDeletingId(null);
        if (res.success && res.updatedAddresses) {
            toast.success("Route removed");
            setAddresses(res.updatedAddresses);
        } else {
            toast.error((res as any).error || "Delete failed");
        }
    };

    const menuItems = [
        { id: 'profile', label: 'Account Overview', icon: UserCog, desc: 'Personal details & identity', active: 'text-blue-600 bg-blue-500/20 shadow-inner', inactive: 'text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/15' },
        { id: 'address', label: 'Shipping Logistics', icon: Truck, desc: 'Clinic addresses & routing', active: 'text-emerald-600 bg-emerald-500/20 shadow-inner', inactive: 'text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500/15' },
        { id: 'payment', label: 'Financial Vault', icon: Wallet, desc: 'Payment methods & billing', active: 'text-amber-600 bg-amber-500/20 shadow-inner', inactive: 'text-amber-500 bg-amber-500/10 group-hover:bg-amber-500/15' },
        { id: 'security', label: 'Access Control', icon: ShieldCheck, desc: 'Passwords & 2FA security', active: 'text-rose-600 bg-rose-500/20 shadow-inner', inactive: 'text-rose-500 bg-rose-500/10 group-hover:bg-rose-500/15' },
        { id: 'notifications', label: 'Comms & Alerts', icon: BellRing, desc: 'Email & push preferences', active: 'text-purple-600 bg-purple-500/20 shadow-inner', inactive: 'text-purple-500 bg-purple-500/10 group-hover:bg-purple-500/15' },
    ];

    return (
        <div className="bg-[#f0f4f8] min-h-screen pt-8 pb-32 relative font-sans overflow-hidden">
            {/* Ultra Premium Cinematic Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full -ml-64 -mb-64 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full rounded-2xl md:rounded-[2rem] overflow-hidden mb-10 bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/40"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-8 gap-4 md:gap-8">
                        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
                            <BackButton className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 border-slate-100 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm shrink-0" />
                            <div className="flex flex-col">
                                <div className="flex flex-col-reverse md:flex-row md:items-center gap-1 md:gap-3 mb-1 md:mb-0">
                                    <h1 className="text-xl md:text-4xl font-black text-slate-900 tracking-tighter">Workspace <span className="text-brand-primary">Preferences</span></h1>
                                    <div className="w-fit px-3 py-1 bg-brand-primary/5 border border-brand-primary/10 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                                        System Configuration
                                    </div>
                                </div>
                                <p className="text-slate-500 text-[11px] md:text-sm font-medium mt-1 md:mt-2 line-clamp-1 md:line-clamp-none leading-relaxed">
                                    Manage your clinical identity, financial conduits, and operational intelligence settings.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 min-h-[700px]">
                    {/* Elite Sidebar Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6"
                    >
                        {/* Elite Profile Mini Card */}
                        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-[0_15px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,100,255,0.08)] transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-brand-primary/20 transition-all pointer-events-none" />
                            <div className="relative flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-blue-400 p-[2px] shadow-[0_0_15px_rgba(0,100,255,0.3)]">
                                    <div className="absolute inset-[2px] rounded-[14px] bg-white overflow-hidden">
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-brand-primary font-black text-2xl uppercase relative">
                                            {profileData.profileImage ? (
                                                <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                session?.user?.name?.[0] || 'D'
                                            )}
                                        </div>
                                    </div>
                                    <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center border-2 border-white hover:scale-110 transition-transform shadow-md cursor-pointer">
                                        {isUploadingPath ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingPath} />
                                    </label>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 leading-tight">{session?.user?.name || 'Dr. Specialist'}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified Partner</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Stack */}
                        <nav className="flex flex-col gap-3">
                            {menuItems.map((item) => {
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`relative w-full p-4 rounded-3xl text-left flex items-start gap-4 transition-all duration-300 group ${isActive
                                            ? 'bg-white shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-white/50 scale-[1.02]'
                                            : 'hover:bg-white/40 border border-transparent hover:scale-[1.01]'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-2xl transition-all duration-300 border border-white/50 ${isActive ? item.active : item.inactive}`}>
                                            <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <h4 className={`text-sm font-black mb-0.5 tracking-tight transition-colors ${isActive ? 'text-brand-primary' : 'text-slate-700 group-hover:text-slate-900'}`}>{item.label}</h4>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{item.desc}</p>
                                        </div>
                                        {isActive && (
                                            <ChevronRight size={16} className="text-brand-primary/30 my-auto" />
                                        )}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-brand-primary rounded-r-full shadow-[0_0_10px_rgba(0,100,255,0.5)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-auto pt-4 hidden lg:block">
                            <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-100 hover:bg-rose-200 rounded-2xl flex justify-center items-center gap-2 transition-all border border-rose-200 hover:border-rose-300 active:scale-95">
                                <LogOut size={14} /> Sever Connection
                            </button>
                        </div>
                    </motion.div>

                    {/* Elite Content Canvas */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex-1 bg-white rounded-[2.5rem] border border-white shadow-[0_25px_60px_rgba(0,0,0,0.05)] p-5 md:p-14 relative overflow-hidden"
                    >
                        {/* Interactive Dynamic Background */}
                        <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-2xl mx-auto md:mx-0 relative z-10"
                                >
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Identity</h2>
                                        <p className="text-slate-500 font-medium text-sm mt-1">Configure your primary clinical details & authorizations.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-100">
                                            <div className="flex flex-col gap-2 group">
                                                <label className="text-[10px] font-black text-slate-400 group-focus-within:text-brand-primary transition-colors uppercase tracking-[0.2em]">First Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.firstName}
                                                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-primary/30 focus:shadow-[0_0_20px_rgba(0,100,255,0.07)] transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300"
                                                    placeholder="Enter First Name"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 group">
                                                <label className="text-[10px] font-black text-slate-400 group-focus-within:text-brand-primary transition-colors uppercase tracking-[0.2em]">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.lastName}
                                                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-primary/30 focus:shadow-[0_0_20px_rgba(0,100,255,0.07)] transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300"
                                                    placeholder="Enter Last Name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between">
                                                    Restricted Email Conduit
                                                    <span className="bg-rose-50 text-rose-500 px-2 py-0.5 rounded text-[8px] font-black animate-pulse">LOCKED</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        defaultValue={session?.user?.email || ''}
                                                        readOnly
                                                        className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-slate-500 cursor-not-allowed text-sm"
                                                    />
                                                    <Key size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 group">
                                                <label className="text-[10px] font-black text-slate-400 group-focus-within:text-brand-primary transition-colors uppercase tracking-[0.2em]">Registered Contact (Phone)</label>
                                                <div className="relative flex">
                                                    <span className="absolute left-0 top-0 h-full px-5 flex items-center justify-center bg-slate-100 border-2 border-r-0 border-slate-100 rounded-l-2xl text-xs font-black text-slate-600 z-10">
                                                        +91
                                                    </span>
                                                    <input
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                        placeholder="99995 78292"
                                                        className="w-full pl-16 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-primary/30 focus:shadow-[0_0_20px_rgba(0,100,255,0.07)] transition-all font-bold text-slate-900 text-sm tracking-widest placeholder:text-slate-300 placeholder:tracking-normal relative"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Globe size={12} /> Syncing Globally
                                            </p>
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="w-full sm:w-auto relative overflow-hidden group bg-brand-primary hover:bg-brand-dark text-white font-black uppercase tracking-[0.2em] text-[10px] px-10 py-4 rounded-2xl transition-all duration-300 shadow-[0_10px_20px_rgba(0,100,255,0.2)] hover:shadow-[0_15px_30px_rgba(0,100,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                <span className={`flex items-center gap-2 justify-center transition-opacity duration-300 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>
                                                    <Save size={14} /> Commit Changes
                                                </span>
                                                {isSaving && (
                                                    <span className="absolute inset-0 flex items-center justify-center gap-2">
                                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Processing
                                                    </span>
                                                )}
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'address' && (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="relative z-10"
                                >
                                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shipping Route Matrix</h2>
                                            <p className="text-slate-500 font-medium text-sm mt-1">Manage delivery locations and Godown addresses.</p>
                                        </div>
                                        {!isAddingRoute && (
                                            <button
                                                onClick={() => setIsAddingRoute(true)}
                                                className="px-5 py-2.5 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                + Add New Route
                                            </button>
                                        )}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {!isAddingRoute ? (
                                            <motion.div
                                                key="list"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            >
                                                {addresses.length === 0 ? (
                                                    <div className="col-span-1 md:col-span-2 p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                                                        No routes configured. Add a new route to enable shipping logic.
                                                    </div>
                                                ) : (
                                                    addresses.map((address) => (
                                                        <div key={address.id} className={`rounded-2xl border-2 transition-all relative overflow-hidden group hover:shadow-lg ${address.isPrimary ? 'border-brand-primary bg-brand-primary/5 hover:shadow-[0_10px_20px_rgba(0,100,255,0.1)]' : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)]'}`}>
                                                            {editingAddressId === address.id ? (
                                                                // Inline Edit Form
                                                                <div className="p-6 space-y-4">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Editing Route</p>
                                                                        <button onClick={() => setEditingAddressId(null)} className="text-slate-400 hover:text-rose-500 text-xs font-bold transition-colors">✕ Cancel</button>
                                                                    </div>
                                                                    <input type="text" value={editAddressForm.facilityName} onChange={e => setEditAddressForm({ ...editAddressForm, facilityName: e.target.value })} placeholder="Facility Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm font-bold text-slate-900 transition-all" />
                                                                    <textarea value={editAddressForm.completeAddress} onChange={e => setEditAddressForm({ ...editAddressForm, completeAddress: e.target.value })} placeholder="Complete Address" rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm font-bold text-slate-900 transition-all resize-none" />
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <input type="text" value={editAddressForm.city} onChange={e => setEditAddressForm({ ...editAddressForm, city: e.target.value })} placeholder="City" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm font-bold text-slate-900 transition-all" />
                                                                        <input type="text" value={editAddressForm.pincode} onChange={e => setEditAddressForm({ ...editAddressForm, pincode: e.target.value })} placeholder="Pincode" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm font-bold text-slate-900 transition-all" />
                                                                    </div>
                                                                    <button onClick={handleUpdateAddress} disabled={isSaving} className="w-full py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                                                        {isSaving ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save size={13} /> Save Changes</>}
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                // Display Mode
                                                                <div className="p-6">
                                                                    {address.isPrimary && <div className="absolute top-4 right-4"><CheckCircle2 size={20} className="text-brand-primary" /></div>}
                                                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${address.isPrimary ? 'text-brand-primary' : 'text-slate-400'}`}>
                                                                        {address.isPrimary ? 'Primary Route' : 'Secondary Node'}
                                                                    </p>
                                                                    <h4 className="font-bold text-slate-900 text-lg mb-1">{address.facilityName}</h4>
                                                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                                                        {address.completeAddress}<br />
                                                                        {address.city} - {address.pincode}
                                                                    </p>
                                                                    <div className="flex gap-3 mt-auto items-center">
                                                                        <button onClick={() => handleEditAddress(address)} className="text-brand-primary font-black text-xs uppercase hover:text-brand-dark transition-colors tracking-wider border border-brand-primary/20 px-3 py-1.5 rounded-lg hover:bg-brand-primary/5">
                                                                            ✏ Edit Config
                                                                        </button>
                                                                        <button onClick={() => handleDeleteAddress(address.id)} disabled={isDeletingId === address.id} className="text-rose-400 font-black text-xs uppercase hover:text-rose-600 transition-colors tracking-wider border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 disabled:opacity-50">
                                                                            {isDeletingId === address.id ? '...' : '✕ Delete'}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="form"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)]"
                                            >
                                                <div className="flex items-center justify-between mb-8 gap-2">
                                                    <div className="flex items-center gap-2 md:gap-3 flex-1">
                                                        <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary shrink-0 hidden sm:block">
                                                            <MapPin size={20} />
                                                        </div>
                                                        <h3 className="font-black text-slate-900 text-base md:text-xl tracking-tight leading-tight">New Route</h3>
                                                    </div>
                                                    <button
                                                        onClick={() => setIsAddingRoute(false)}
                                                        className="shrink-0 text-slate-400 hover:text-rose-500 font-bold text-[9px] md:text-xs uppercase tracking-widest transition-colors px-3 py-1.5 bg-slate-50 hover:bg-rose-50 rounded-lg border border-slate-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>

                                                <div className="space-y-5">
                                                    <div className="flex flex-col gap-2 group">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-brand-primary transition-colors">Facility Name</label>
                                                        <input type="text" value={newAddressForm.facilityName} onChange={(e) => setNewAddressForm({ ...newAddressForm, facilityName: e.target.value })} placeholder="e.g. South Wing Dental Clinic" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-slate-900 placeholder:text-slate-300" />
                                                    </div>
                                                    <div className="flex flex-col gap-2 group">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-brand-primary transition-colors">Complete Address</label>
                                                        <textarea value={newAddressForm.completeAddress} onChange={(e) => setNewAddressForm({ ...newAddressForm, completeAddress: e.target.value })} placeholder="Block / Street / Area" rows={3} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-slate-900 resize-none placeholder:text-slate-300" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex flex-col gap-2 group">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-brand-primary transition-colors">City</label>
                                                            <input type="text" value={newAddressForm.city} onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })} placeholder="City" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-slate-900 placeholder:text-slate-300" />
                                                        </div>
                                                        <div className="flex flex-col gap-2 group">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-brand-primary transition-colors">Pincode</label>
                                                            <input type="text" value={newAddressForm.pincode} onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })} placeholder="Digits" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-slate-900 placeholder:text-slate-300" />
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 border-t border-slate-100">
                                                        <button
                                                            onClick={handleSaveAddressRoute}
                                                            disabled={isSaving}
                                                            className="w-full md:w-auto px-10 py-4 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-dark transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(0,100,255,0.2)] hover:shadow-[0_15px_30px_rgba(0,100,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group"
                                                        >
                                                            {isSaving ? (
                                                                <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing</span>
                                                            ) : (
                                                                <span className="flex items-center gap-2"><Save size={14} className="group-hover:scale-110 transition-transform" /> Deploy New Route</span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {activeTab === 'payment' && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10"
                                >
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Financial Conduits</h2>
                                    <p className="text-slate-500 font-medium text-sm mb-8">Encrypted secure payment vault and billing links.</p>

                                    <div className="bg-slate-900 rounded-[1.5rem] md:rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 mb-8 w-full max-w-[340px] md:max-w-sm hover:scale-[1.02] transition-transform mx-auto md:mx-0">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full" />
                                        <div className="absolute bottom-[-10px] right-[-10px]"><CreditCard size={120} className="text-white/5 shadow-inner" /></div>

                                        <div className="flex justify-between items-center mb-8 md:mb-10 relative z-10">
                                            <div className="w-10 h-7 md:w-12 md:h-8 rounded bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                                <div className="w-5 h-4 md:w-6 md:h-5 stroke-2 border2 border-slate-900/50 rounded-sm bg-gradient-to-br from-amber-200 to-amber-400" />
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <p className="font-black italic text-lg md:text-xl drop-shadow-md">VISA</p>
                                                <span className="text-[7px] md:text-[8px] bg-red-500/80 px-2 py-0.5 rounded text-white tracking-widest uppercase font-black">ON HOLD</span>
                                            </div>
                                        </div>
                                        <p className="font-mono text-lg md:text-xl tracking-[0.15em] md:tracking-[0.2em] mb-4 text-slate-200">**** **** **** 4892</p>
                                        <div className="flex justify-between items-end relative z-10">
                                            <div className="flex-1">
                                                <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-slate-400 font-bold mb-1">Cardholder Entity</p>
                                                <p className="font-bold tracking-widest uppercase text-xs md:text-sm truncate pr-2">{session?.user?.name || 'Authorized User'}</p>
                                            </div>
                                            <div className="shrink-0 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                                                <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Valid Thru</p>
                                                <p className="font-bold tracking-widest text-xs md:text-sm">12/28</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button disabled className="mx-auto md:mx-0 w-fit px-6 py-3.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-black uppercase tracking-[0.1em] flex items-center gap-2 border border-slate-200 cursor-not-allowed shadow-inner">
                                        <CreditCard size={16} /> Integration Pending
                                    </button>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10 max-w-xl"
                                >
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1">Access Control Matrix</h2>
                                    <p className="text-slate-500 font-medium text-[11px] md:text-sm mb-8">Update cryptographic keys & view active sessions.</p>

                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-2 group">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-brand-primary transition-colors">Current Authorization Key</label>
                                            <input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-primary/30 focus:shadow-[0_0_20px_rgba(0,100,255,0.07)] transition-all font-bold text-slate-900 text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2 group">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-brand-primary transition-colors">New Authorization Key</label>
                                            <input type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} placeholder="Enter new password" className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-primary/30 focus:shadow-[0_0_20px_rgba(0,100,255,0.07)] transition-all font-bold text-slate-900 text-sm" />
                                        </div>
                                        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-amber-200 bg-amber-50/50 rounded-2xl relative overflow-hidden group gap-4">
                                            <div className="absolute right-0 top-0 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform" />
                                            <div className="relative z-10">
                                                <h4 className="font-bold text-slate-900 text-sm mb-1 text-amber-900 flex items-center gap-2">
                                                    Two-Factor Auth (2FA) <Shield size={14} className="text-amber-500" />
                                                </h4>
                                                <p className="text-[10px] md:text-xs text-amber-700/70 font-medium leading-relaxed">Add an extra layer of structural integrity.</p>
                                            </div>
                                            <button disabled className="w-fit bg-white/80 text-amber-800/50 px-5 py-2.5 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm relative z-10 border border-amber-200/50 cursor-not-allowed">
                                                Coming Soon
                                            </button>
                                        </div>

                                        <div className="pt-4">
                                            <button onClick={handleSavePassword} disabled={isSaving} className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(0,100,255,0.2)] hover:shadow-[0_15px_30px_rgba(0,100,255,0.3)] disabled:opacity-70 group">
                                                {isSaving ? (
                                                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing</span>
                                                ) : (
                                                    <><Shield size={16} className="group-hover:scale-110 transition-transform" /> Update Security Protocols</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'notifications' && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10 max-w-2xl"
                                >
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Communications & Alerts</h2>
                                    <p className="text-slate-500 font-medium text-sm mb-8">Manage how the system communicates tactical intelligence to you.</p>

                                    <div className="space-y-4">
                                        {[
                                            { id: 'orderStatus' as const, title: 'Order Status Pipelines', desc: 'Real-time updates on your logistics & tracking.' },
                                            { id: 'promotions' as const, title: 'Promotional Transmissions', desc: 'Discount nodes and tactical offers on premium gear.' },
                                            { id: 'security' as const, title: 'Security Alerts', desc: 'Imperative warnings regarding login node changes.', locked: true },
                                            { id: 'restocks' as const, title: 'Product Restock Pings', desc: 'Immediate signals when saved items return to inventory.' },
                                        ].map((item, i) => {
                                            const isActive = item.locked ? true : notificationsPrefs[item.id as keyof typeof notificationsPrefs];

                                            return (
                                                <div key={i} className="flex items-center justify-between p-4 md:p-5 border border-slate-100 rounded-2xl bg-white hover:border-slate-200 transition-colors shadow-sm gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-900 text-[13px] md:text-sm mb-0.5 md:mb-1 truncate md:whitespace-normal">{item.title}</h4>
                                                        <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-tight line-clamp-2 md:line-clamp-none">{item.desc}</p>
                                                    </div>
                                                    <div className="shrink-0">
                                                        {item.locked ? (
                                                            <div className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black text-slate-400 tracking-widest uppercase shadow-inner whitespace-nowrap">
                                                                Force ON
                                                            </div>
                                                        ) : (
                                                            <div
                                                                onClick={() => toggleNotification(item.id as keyof typeof notificationsPrefs)}
                                                                className={`w-10 h-5 md:w-12 md:h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${isActive ? 'bg-brand-primary hover:bg-brand-dark' : 'bg-slate-200 hover:bg-slate-300'}`}
                                                            >
                                                                <motion.div
                                                                    initial={false}
                                                                    animate={{ x: isActive ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 22 : 26) : 4 }}
                                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                    className="absolute top-0.5 md:top-1 w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Mobile Only Logout Button */}
                        <div className="mt-12 pt-8 border-t border-slate-100 lg:hidden">
                            <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-100 hover:bg-rose-200 rounded-2xl flex justify-center items-center gap-2 transition-all border border-rose-200 hover:border-rose-300 active:scale-95">
                                <LogOut size={14} /> Sever Connection
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
