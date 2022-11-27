import { createHash, randomBytes } from "crypto";


const TOKEN_SIZE = 32;
const TOKEN_SEPARATOR = '|';

interface CreateCSRFTokenParams {
  secret:string
}

interface VerifyCSRFTokenParams {
   token:string
   secret:string
}

function createCSRFTokenHash(csrfToken:string, secret:string) {
   return createHash("sha256")
      .update(`${csrfToken}${secret}`)
      .digest("hex")
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
}: CreateCSRFTokenParams) {
  const csrfToken = randomBytes(TOKEN_SIZE).toString("hex")
  const csrfTokenHash = createCSRFTokenHash(csrfToken, secret)
  const cookie = `${csrfToken}${TOKEN_SEPARATOR}${csrfTokenHash}`

  return { cookie, csrfToken }
}

/**
 * Verifies a token presumably created by createCSRFToken and return true if it
 * verifies, or false otherwise
 */
export function verifyCSRFToken({
   token,
   secret
}: VerifyCSRFTokenParams) {
   const [ csrfToken, csrfTokenHash ] = token?.split(TOKEN_SEPARATOR) ?? [];
   const csrfTokenHashVerify = createCSRFTokenHash(csrfToken, secret)
   return csrfTokenHashVerify === csrfTokenHash
}