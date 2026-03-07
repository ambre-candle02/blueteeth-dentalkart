'use server';

import { signIn } from '@/auth';

import { db, auth } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const email = (formData.get('email') as string)?.trim();
        const mobile = (formData.get('mobile') as string)?.trim();
        const password = formData.get('password') as string;


        let isUserAdmin = false;
        try {
            const usersRef = db.collection('users');
            const snapshot = email
                ? await usersRef.where('email', '==', email).get()
                : (mobile ? await usersRef.where('mobile', '==', mobile).get() : null);

            if (snapshot && !snapshot.empty) {
                isUserAdmin = snapshot.docs[0].data().role === 'ADMIN';
            }
        } catch (e) { console.error("Could not fetch pre-login role", e) }

        await signIn('credentials', {
            email,
            mobile,
            password,
            redirectTo: isUserAdmin ? '/admin' : '/'
        });
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT') || error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }

        if (error.type === 'CredentialsSignin' || error.message?.includes('CredentialsSignin')) {
            return 'Invalid credentials.';
        }
        return 'Something went wrong.';
    }
}

export async function registerAccount(
    prevState: string | undefined,
    formData: FormData,
) {
    noStore();
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim() || undefined;
    const mobile = (formData.get('mobile') as string)?.trim() || undefined;
    const password = formData.get('password') as string;

    if (!name || (!email && !mobile) || !password) {
        return 'Please provide name, password, and either email or mobile.';
    }

    try {
        const usersRef = db.collection('users');
        let existingUser = null;

        if (email) {
            const trimmedEmail = email.trim();

            const emailCheck = await usersRef.where('email', '==', trimmedEmail).get();
            if (!emailCheck.empty) {
                existingUser = emailCheck.docs[0].data();

            }
        }

        if (!existingUser && mobile) {
            const trimmedMobile = mobile.trim();

            const mobileCheck = await usersRef.where('mobile', '==', trimmedMobile).get();
            if (!mobileCheck.empty) {
                existingUser = mobileCheck.docs[0].data();

            }
        }

        if (existingUser) {
            // IDEMPOTENCY: If user already exists, verify password and log them in

            const passwordsMatch = await bcrypt.compare(password, existingUser.password);
            if (passwordsMatch) {

            } else {
                return `User with this ${email ? 'email' : 'mobile'} already exists with a different password.`;
            }
        } else {
            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserRef = usersRef.doc();
            await newUserRef.set({
                name,
                email: email || null,
                mobile: mobile || null,
                password: hashedPassword,
                role: 'user',
                createdAt: new Date().toISOString()
            });
        }


        // Small delay to ensure Firestore data is readable
        await new Promise(resolve => setTimeout(resolve, 1000));


        await signIn('credentials', {
            email,
            mobile,
            password,
            redirectTo: '/'
        });

    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT') || error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('Registration/Signup sequence failed catch:', error);

        if (error.type === 'CredentialsSignin' || error.message?.includes('CredentialsSignin')) {
            console.error("AuthDetails:", {
                message: error.message,
                stack: error.stack
            });
            return `Registration successful, but login failed. Error: ${error.message}. Please sign in manually.`;
        }

        return `Registration failed: ${error.message || 'Unknown error'}`;
    }
}

export async function resetDatabase() {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            return { success: true, message: "No users to delete." };
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        return { success: true, message: "All users deleted successfully. You can now signup again." };
    } catch (error: any) {
        console.error("Failed to reset database:", error);
        return { success: false, message: `Failed to reset database: ${error.message}` };
    }
}

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get('email') as string;
    if (!email) return { success: false, message: "Email is required." };

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email.trim()).get();

        if (snapshot.empty) {
            // Security best practice: don't reveal if email exists
            return { success: true, message: "If this email is registered, you will receive a reset link shortly." };
        }

        const userDoc = snapshot.docs[0];

        // Generate a secure token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 3600000; // 1 hour

        // Save token to user doc
        await userDoc.ref.update({
            resetToken: token,
            resetTokenExpiry: expiresAt,
        });

        // Generate link
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email.trim())}`;

        const { sendPasswordResetEmail } = await import('@/lib/email');
        const result = await sendPasswordResetEmail(email, resetLink);

        if (!result.success) {
            return { success: false, message: "Failed to send email. Please check server configuration." };
        }

        return { success: true, message: "Reset link sent successfully!" };
    } catch (error: any) {
        console.error("Password reset request error:", error);
        return { success: false, message: "Internal server error." };
    }
}

export async function confirmPasswordReset(formData: FormData) {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;
    const email = formData.get('email') as string;

    if (!password || !email || !token) {
        return { success: false, message: "Password, token, and verification email are required." };
    }

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email.trim()).get();

        if (snapshot.empty) {
            return { success: false, message: "Account not found." };
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (!userData.resetToken || userData.resetToken !== token) {
            return { success: false, message: "Invalid or expired reset token." };
        }

        if (!userData.resetTokenExpiry || userData.resetTokenExpiry < Date.now()) {
            return { success: false, message: "Reset token has expired. Please request a new one." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userDoc.ref.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
            updatedAt: new Date().toISOString()
        });

        return { success: true, message: "Password updated successfully! You can now login." };
    } catch (error: any) {
        console.error("Confirm password reset error:", error);
        return { success: false, message: "Failed to reset password." };
    }
}


import { auth as nextAuth } from '@/auth';

async function verifyAdmin() {
    const session = await nextAuth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        throw new Error("Unauthorized Access: Admin privileges required.");
    }
}

export async function getUsers() {
    noStore();
    try {
        await verifyAdmin();
        const usersRef = db.collection('users');
        const snapshot = await usersRef.orderBy('createdAt', 'desc').get();

        const users = snapshot.docs.map(doc => {
            const { password, resetToken, resetTokenExpiry, ...rest } = doc.data();
            return {
                id: doc.id,
                ...rest
            };
        });

        return { success: true, users: JSON.parse(JSON.stringify(users)) };
    } catch (error: any) {
        console.error("Failed to fetch users:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteUser(id: string) {
    try {
        await verifyAdmin();
        await db.collection('users').doc(id).delete();
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete user:", error);
        return { success: false, error: error.message };
    }
}

export async function toggleUserRole(id: string, currentRole: string) {
    try {
        await verifyAdmin();
        const newRole = currentRole === 'ADMIN' ? 'user' : 'ADMIN';
        await db.collection('users').doc(id).update({
            role: newRole,
            updatedAt: new Date().toISOString()
        });
        revalidatePath('/admin/users');
        return { success: true, newRole };
    } catch (error: any) {
        console.error("Failed to toggle user role:", error);
        return { success: false, error: error.message };
    }
}

