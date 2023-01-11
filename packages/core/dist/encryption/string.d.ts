/// <reference types="node" />
import type { KeyObject } from 'crypto';
export interface EncryptionArg {
    text: string;
    secretKey: KeyObject;
}
export type EntryptionValue = string;
export interface DecryptionArg {
    encrypted: string;
    secretKey: KeyObject;
}
export type DecryptionValue = string | null;
/**
 * Make sure the secret key is valid
 * @param secret
 */
export declare function validateSecret(secret: string): KeyObject;
/**
 * Encrypt a given text using the provided secret key. The key may be of any
 * length greater or equal to 32 bytes, but only the first 32 bytes will be used.
 * The resulted value consists of the public key, followed by the encrypted data,
 * separated by a semicolon.
 */
export declare function encrypt({ text, secretKey }: EncryptionArg): EntryptionValue;
/**
 * Decrypt a given encrypted string using the provided secret key. As for the
 * encrypt function, only the first 32 bytes of the secret will be used. If
 * the encrypted value cannot be decrypted, the function will return null.
 */
export declare function decrypt({ encrypted, secretKey }: DecryptionArg): DecryptionValue;
//# sourceMappingURL=string.d.ts.map