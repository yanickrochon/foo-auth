import {
  createSecretKey as _createSecretKey,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "crypto";
import type { SecretKey } from "../types";

const ALGORITHM = "aes-256-cbc";
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const TOKEN_ENCODING = "base64";
const TEXT_ENCODING = "utf-8";

const SECRET_MIN_LENGTH = 32;

export interface EncryptionArg {
  text: string;
  secretKey: SecretKey;
}

export type EntryptionValue = string;

export interface DecryptionArg {
  encrypted: string;
  secretKey: SecretKey;
}

export type DecryptionValue = string | null;

/**
 * Make sure the secret key is valid
 * @param secret
 */
export function createSecretKey(secret: string): SecretKey {
  if (secret.length < SECRET_MIN_LENGTH) {
    throw new Error(`Secret must be at least ${SECRET_MIN_LENGTH} characters`);
  }

  return _createSecretKey(secret.substring(0, KEY_LENGTH), TEXT_ENCODING);
}

/**
 * Encrypt a given text using the provided secret key. The key may be of any
 * length greater or equal to 32 bytes, but only the first 32 bytes will be used.
 * The resulted value consists of the public key, followed by the encrypted data,
 * separated by a semicolon.
 */
export function encryptString({
  text,
  secretKey,
}: EncryptionArg): EntryptionValue {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, secretKey, iv);
  return Buffer.concat([cipher.update(text), cipher.final(), iv]).toString(
    TOKEN_ENCODING
  );
}

/**
 * Decrypt a given encrypted string using the provided secret key. As for the
 * encrypt function, only the first 32 bytes of the secret will be used. If
 * the encrypted value cannot be decrypted, the function will return null.
 */
export function decryptString({
  encrypted,
  secretKey,
}: DecryptionArg): DecryptionValue {
  try {
    const binaryData = Buffer.from(encrypted, TOKEN_ENCODING);
    const iv = binaryData.subarray(-IV_LENGTH);
    const encryptedData = binaryData.subarray(0, binaryData.length - IV_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, secretKey, iv);

    return Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]).toString();
  } catch (err) {
    return null;
  }
}
