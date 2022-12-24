import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
const ALGORITHM = "aes-256-cbc";
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const TOKEN_SEPARATOR = ';';
const STRING_ENCODING = "base64";
;
;
/**
 * Encrypt a given text using the provided secret key. The key may be of any
 * length greater or equal to 32 bytes, but only the first 32 bytes will be used.
 * The resulted value consists of the public key, followed by the encrypted data,
 * separated by a semicolon.
 */
export function encrypt({ text, secret }) {
    if (secret.length < KEY_LENGTH) {
        throw new Error('Secret must be at least 32 bytes');
    }
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, secret.substring(0, KEY_LENGTH), iv);
    const encryptedData = Buffer.concat([cipher.update(text), cipher.final()]);
    const encrypted = `${iv.toString(STRING_ENCODING)}${TOKEN_SEPARATOR}${encryptedData.toString(STRING_ENCODING)}`;
    return encrypted;
}
/**
 * Decrypt a given encrypted string using the provided secret key. As for the
 * encrypt function, only the first 32 bytes of the secret will be used. If
 * the encrypted value cannot be decrypted, the function will return null.
 */
export function decrypt({ encrypted, secret }) {
    if (secret.length < KEY_LENGTH) {
        throw new Error('Secret must be at least 32 bytes');
    }
    try {
        const [iv, encryptedData] = encrypted.split(TOKEN_SEPARATOR);
        const ivBuffer = Buffer.from(iv, STRING_ENCODING);
        const decipher = createDecipheriv(ALGORITHM, secret.substring(0, KEY_LENGTH), ivBuffer);
        const encryptedBuffer = Buffer.from(encryptedData, STRING_ENCODING);
        const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
        return decrypted.toString();
    }
    catch (err) {
        return null;
    }
}
