import * as crypto from 'crypto'
import { envconfig } from './config';
export class Encryption {
    private key = crypto.createHash("sha256").update(envconfig.ENCRYPTION_KEY).digest();
    encrypt(text: string) {
        const hashedKey = crypto.createHash("sha256").update(this.key as any).digest();
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv("aes-256-gcm", hashedKey as any, iv as any);
        let encrypted = cipher.update(text, "utf8", "base64");
        encrypted += cipher.final("base64")
        const authTag = cipher.getAuthTag().toString("base64");
        const combined = JSON.stringify({
            ciphertext: encrypted,
            iv: iv.toString("base64"),
            authTag: authTag,
        });
        return Buffer.from(combined).toString("base64");
    }
    decrypt(encryptedText: string) {
        const hashedKey = crypto.createHash("sha256").update(this.key as any).digest();
        const decoded = JSON.parse(Buffer.from(encryptedText, "base64").toString("utf8"));
        const { ciphertext, iv, authTag } = decoded;
        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            hashedKey as any,
            Buffer.from(iv, "base64") as any
        );
        decipher.setAuthTag(Buffer.from(authTag, "base64") as any);
        let decrypted = decipher.update(ciphertext, "base64", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
}
export const encryptionHandler = new Encryption()