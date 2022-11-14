import { createHash, randomBytes } from "crypto";
const TOKEN_SIZE = 32;
const TOKEN_SEPARATOR = '|';
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
export function createCSRFToken({ secret }) {
    const csrfToken = randomBytes(TOKEN_SIZE).toString("hex");
    const csrfTokenHash = createHash("sha256")
        .update(`${csrfToken}${secret}`)
        .digest("hex");
    const cookie = `${csrfToken}${TOKEN_SEPARATOR}${csrfTokenHash}`;
    return { cookie, csrfToken };
}
/**
 * Verifies a token presumably created by createCSRFToken and return true if it
 * verifies, or false otherwise
 */
export function verifyCSRFToken({ token, secret }) {
    var _a;
    const [csrfToken, csrfTokenHash] = (_a = token === null || token === void 0 ? void 0 : token.split(TOKEN_SEPARATOR)) !== null && _a !== void 0 ? _a : [];
    const csrfTokenHashVerify = createHash("sha256")
        .update(`${csrfToken}${secret}`)
        .digest("hex");
    return csrfTokenHashVerify === csrfTokenHash;
}
