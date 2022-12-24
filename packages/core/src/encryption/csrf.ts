import { createHash, randomBytes, sign } from "crypto";


const HASH_ALGORITHM = "sha256";
const TOKEN_SIZE = 32;
const TOKEN_SEPARATOR = ';';
const STRING_ENCODING = "base64";

export interface CreateCSRFTokenArg {
  secret:string
};

export type CSRFToken = string;

export interface VerifyCSRFTokenArg {
  token:string;
  secret:string;
};

export type CSRFTokenVerified = boolean;



function createCSRFTokenHash(signature:string, secret:string):string {
   return createHash(HASH_ALGORITHM)
      .update(`${signature}${secret}`)
      .digest(STRING_ENCODING)
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
export function createCSRFToken({
  secret
}: CreateCSRFTokenArg):CSRFToken {
  const signature = randomBytes(TOKEN_SIZE).toString(STRING_ENCODING);
  const tokenHash = createCSRFTokenHash(signature, secret);
  const token = `${signature}${TOKEN_SEPARATOR}${tokenHash}`;

  return token;
}

/**
 * Verifies a token presumably created by createCSRFToken and return true if it
 * verifies, or false otherwise
 */
export function verifyCSRFToken({
  token,
  secret
}: VerifyCSRFTokenArg):CSRFTokenVerified {
  const [ signature, tokenHash ] = token?.split(TOKEN_SEPARATOR) ?? [];
  const tokenHashVerify = createCSRFTokenHash(signature, secret);

  return tokenHashVerify === tokenHash;
}