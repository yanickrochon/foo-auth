import { encrypt, decrypt } from '../encryption/string';
export const JWT_HEADER_NAME = 'x-authorized';
export function sessionCookie() {
    return ({ req, secret }) => ({
        clearSession() {
            /* nothing */
        },
        getSessionToken() {
            return req.headers[JWT_HEADER_NAME] || undefined;
        },
        getSession() {
            const encrypted = req.headers[JWT_HEADER_NAME];
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
            return encrypted;
        },
    });
}
;
