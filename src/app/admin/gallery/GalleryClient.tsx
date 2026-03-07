"use client";

import { useState, useRef } from "react";
import { Copy, Trash2, UploadCloud, CheckCircle2, Film, Image as ImageIcon, Loader2, Link as LinkIcon } from "lucide-react";
import { saveMediaRecord, deleteMedia } from "@/actions/media-actions";
import { getCloudinarySignature } from "@/actions/upload-actions";
import { toast } from "sonner";
import Image from "next/image";

export function GalleryClient({ initialItems }: { initialItems: any[] }) {
    const [items, setItems] = useState<{ id: string, url: string, createdAt: string }[]>(initialItems);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Allowing up to 40MB for large marketing assets
        if (file.size > 40 * 1024 * 1024) {
            toast.error("File size should be less than 40MB. For larger files, kindly use YouTube/Vimeo links.");
            return;
        }

        setIsUploading(true);
        const loadingToast = toast.loading("Securely transferring your media directly to Cloud vault...");

        try {
            // 1. Get upload signature from server
            const customFolder = "media-hub";
            const sigData = await getCloudinarySignature(customFolder);

            // 2. Upload directly to Cloudinary from client bypasses Next.js server limits completely
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", sigData.apiKey);
            formData.append("timestamp", sigData.timestamp.toString());
            formData.append("signature", sigData.signature);
            formData.append("folder", customFolder);

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`, {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                const errorData = await uploadRes.json();
                throw new Error(errorData.error?.message || "Cloudinary direct upload failed");
            }

            const uploadData = await uploadRes.json();

            // 3. Save the record in Firebase via our action
            const result = await saveMediaRecord(uploadData.secure_url, uploadData.public_id);

            toast.dismiss(loadingToast);

            if (result.success && result.id) {
                toast.success("Media uploaded successfully");
                setItems([{ id: result.id, url: uploadData.secure_url, createdAt: new Date().toISOString() }, ...items]);
            } else {
                toast.error(result.error || "Failed to save media record");
            }
        } catch (error: any) {
            toast.dismiss(loadingToast);
            console.error("Upload error:", error);
            toast.error(error.message || "An error occurred during upload");
        }

        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDelete = async (id: string, url: string) => {
        if (!confirm("Are you sure you want to delete this media? It might break references if used elsewhere.")) return;

        const loadingToast = toast.loading("Removing media...");
        const result = await deleteMedia(id, url);
        toast.dismiss(loadingToast);

        if (result.success) {
            toast.success("Media permanently deleted");
            setItems(items.filter(i => i.id !== id));
        } else {
            toast.error("Failed to delete media");
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard! You can use it anywhere now.");
    };

    const isVideo = (url: string) => {
        return !!url.match(/\.(mp4|webm|ogg)$/i) || url.includes('/video/upload/');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">Media Vault</h1>
                    <p className="text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest opacity-60 italic">Store, manage and generate links for images & videos.</p>
                </div>

                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden"
                        accept="image/*,video/mp4,video/webm"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-[12px] uppercase tracking-[0.1em] shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                        {isUploading ? 'Uploading Data...' : 'Upload New Media'}
                    </button>
                </div>
            </div>

            <div className="bg-white/30 backdrop-blur-xl rounded-3xl border border-blue-200/40 shadow-xl overflow-hidden p-8 min-h-[500px]">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <div className="w-24 h-24 bg-blue-50/50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6 border border-blue-100 shadow-inner">
                            <ImageIcon size={40} className="opacity-50" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest text-sm mb-2">Vault Empty</h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] italic max-w-sm text-center leading-relaxed">
                            Upload your proprietary images or marketing videos here to instantly generate public links for use across the platform.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => {
                            const video = isVideo(item.url);
                            return (
                                <div key={item.id} className="group relative bg-white rounded-2xl border border-blue-100/50 p-2 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-full">
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100/50 flex items-center justify-center">
                                        {video ? (
                                            <video src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" preload="metadata" />
                                        ) : (
                                            <div className="w-full h-full relative">
                                                <Image src={item.url} alt="Media upload" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        )}

                                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                                            {video ? <Film size={12} className="text-white" /> : <ImageIcon size={12} className="text-white" />}
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{video ? 'Video' : 'Image'}</span>
                                        </div>

                                        {/* Hover Overlay Actions */}
                                        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => copyToClipboard(item.url)}
                                                className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 hover:scale-110 hover:shadow-lg transition-transform"
                                                title="Copy Link"
                                            >
                                                <LinkIcon size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id, item.url)}
                                                className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-transform"
                                                title="Delete Media"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-3 mt-auto">
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center justify-between gap-3">
                                            <div className="truncate text-[10px] font-mono text-slate-500 font-bold opacity-80" title={item.url}>
                                                {item.url}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(item.url)}
                                                className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg transition-colors border border-transparent shrink-0"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                        <div className="mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between px-1 opacity-60">
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
