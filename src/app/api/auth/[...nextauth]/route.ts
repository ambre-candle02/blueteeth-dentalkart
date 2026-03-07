import { handlers } from "@/auth"; // Referring to src/auth.ts
export const { GET, POST } = handlers;
export const runtime = 'nodejs'; // Force Node.js runtime for Firebase Admin compatibility
