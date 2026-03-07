import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

async function getUser(identifier: string): Promise<any> {
    try {
        const usersRef = db.collection('users');

        // Try finding by email
        let queryFn = usersRef.where('email', '==', identifier);
        let snapshot = await queryFn.get();

        if (snapshot.empty) {
            // Try finding by mobile
            queryFn = usersRef.where('mobile', '==', identifier);
            snapshot = await queryFn.get();
        }

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Failed to fetch user from Firestore:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, mobile, password } = credentials as Record<string, string>;
                const identifier = (email || mobile || '').trim();

                if (!identifier || !password) {
                    return null;
                }

                try {
                    const user = await getUser(identifier);

                    if (!user) {
                        console.log("Auth failed: User not found for identifier:", identifier);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        console.log("Auth success for:", identifier);
                        return {
                            id: user.id || identifier,
                            name: user.name,
                            email: user.email,
                            mobile: user.mobile,
                            role: user.role
                        };
                    } else {
                        console.log("Auth failed: Password mismatch for:", identifier);
                    }
                } catch (err) {
                    console.error('Authorize callback error:', err);
                }

                return null;
            },
        }),
    ],
});
