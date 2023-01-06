import { encrypt, decrypt } from '../encryption/string';
export const SESSION_COOKIE_NAME = 'foo-auth:session';
export function sessionCookie() {
    return ({ sessionName = SESSION_COOKIE_NAME, cookies, secret }) => ({
        clearSession() {
            cookies.set(sessionName, null);
        },
        getSessionToken() {
            return undefined;
        },
        getSession() {
            var _a;
            const encrypted = (_a = cookies.get(sessionName)) !== null && _a !== void 0 ? _a : '';
            try {
                const decrypted = decrypt({ encrypted, secret });
                return decrypted ? JSON.parse(decrypted) : null;
            }
            catch (e) {
                return null; // failed to parse cookie, assume invalid session
            }
        },
        setSession(session) {
            const encrypted = encrypt({
                text: JSON.stringify(session),
                secret
            });
            cookies.set(sessionName, encrypted);
            return encrypted;
        },
    });
}
;
