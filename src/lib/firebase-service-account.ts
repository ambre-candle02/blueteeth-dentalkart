import * as fs from "fs";
import * as path from "path";

function loadServiceAccount() {
    try {
        const saPath = path.join(process.cwd(), "service-account.json");
        if (fs.existsSync(saPath)) {
            return JSON.parse(fs.readFileSync(saPath, "utf-8"));
        }
    } catch (e) {
        // Ignore read errors
    }

    // Fallback: construct from environment variables (used on Vercel/Production)
    return {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        universe_domain: "googleapis.com",
    };
}

export const serviceAccount = loadServiceAccount();
