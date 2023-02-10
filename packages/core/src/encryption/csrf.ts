import { createHash, randomBytes } from "crypto";
import type { KeyObject } from "crypto";

const HASH_ALGORITHM = "sha256";
const TOKEN_SIGNATURE_SIZE = 32;
const TOKEN_SEPARATOR = ";";
const TOKEN_ENCODING = "base64";

export type CSRFToken = string;

export interface VerifyCSRFTokenArg {
  token: string;
}

export type CSRFTokenVerified = boolean;

function createCSRFTokenHash(signature: string): string {
  return createHash(HASH_ALGORITHM).update(signature).digest(TOKEN_ENCODING);
}

/**
 * Creates a cookie value 'token|hash', where 'token' is the CSRF token and 'hash'
 * is a hash made of the token and the secret, and the two values are joined by a
 * pipe '|'. By storing the value and the hash of the value (with the secret used
 * as a salt) we can verify the cookie was set by the server and not by a malicous
 * attacker.
 *
 * For more details, see the following OWASP links:
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
 * https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf
 */
export function createCSRFToken(): CSRFToken {
  const signature = randomBytes(TOKEN_SIGNATURE_SIZE).toString(TOKEN_ENCODING);
  const tokenHash = createCSRFTokenHash(signature);
  const token = `${signature}${TOKEN_SEPARATOR}${tokenHash}`;

  return token;
}

/**
 * Verifies a token presumably created by createCSRFToken and return true if it
 * verifies, or false otherwise
 */
export function verifyCSRFToken({
  token,
}: VerifyCSRFTokenArg): CSRFTokenVerified {
  if (token) {
    const [signature, tokenHash] = token?.split(TOKEN_SEPARATOR) ?? [];
    const tokenHashVerify = createCSRFTokenHash(signature);

    return tokenHashVerify === tokenHash;
  } else {
    return false;
  }
}
