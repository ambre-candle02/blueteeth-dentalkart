'use server';

import cloudinary from '@/lib/cloudinary';
import { auth } from '@/auth';

export async function getCloudinarySignature(folder: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        throw new Error("Unauthorized Access: Admin privileges required.");
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET!
    );

    return {
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!
    };
}

export async function uploadImageToCloudinary(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract custom folder if provided, else root
        const customFolder = formData.get('folder') as string;
        const targetFolder = customFolder
            ? `blueteeth_dentalkart/${customFolder.replace(/[^a-zA-Z0-9_-]/g, '_')}`
            : 'blueteeth_dentalkart';

        // Upload to Cloudinary using upload_stream to support larger chunks
        const response: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: targetFolder, resource_type: "auto" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return {
            success: true,
            url: response.secure_url,
            publicId: response.public_id
        };
    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        return { success: false, error: error.message || "Failed to upload image" };
    }
}

export async function deleteImageFromCloudinary(publicIdOrUrl: string) {
    try {
        if (!publicIdOrUrl) return { success: true }; // Nothing to delete

        let publicId = publicIdOrUrl;

        // If it's a URL, attempt to extract the publicId
        if (publicIdOrUrl.startsWith('http')) {
            const urlParts = publicIdOrUrl.split('/');
            // Cloudinary URLs usually have the public ID structure after the upload/ or v{version}/
            const uploadIndex = urlParts.findIndex(part => part === 'upload');
            if (uploadIndex !== -1) {
                // Determine if there's a version number v12345/
                let startIndex = uploadIndex + 1;
                if (urlParts[startIndex].startsWith('v') && !isNaN(parseInt(urlParts[startIndex].substring(1)))) {
                    startIndex++;
                }

                // Join remaining parts to form public ID with folder structure, and remove extension
                const idWithExtension = urlParts.slice(startIndex).join('/');
                publicId = idWithExtension.substring(0, idWithExtension.lastIndexOf('.')) || idWithExtension;
            } else {
                return { success: false, error: "Invalid Cloudinary URL formatting" };
            }
        }

        const result = await cloudinary.uploader.destroy(publicId);
        return { success: result.result === 'ok', result };
    } catch (error: any) {
        console.error("Cloudinary Delete Error:", error);
        return { success: false, error: error.message };
    }
}
