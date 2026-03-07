import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login', // We will create a custom login page later
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isSetupPage = nextUrl.pathname === '/admin/setup' || nextUrl.pathname === '/init-admin';

            if (isOnAdmin && !isSetupPage) {
                if (isLoggedIn) {
                    // Check if the user has the ADMIN role
                    return (auth?.user as any)?.role === 'ADMIN';
                }
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.mobile = (user as any).mobile;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                (session.user as any).mobile = token.mobile;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
