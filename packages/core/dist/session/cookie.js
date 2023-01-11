//import * as jose from 'jose';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { encrypt, decrypt } from '../encryption/string';
export const DEFAULT_SESSION_COOKIE_NAME = 'foo-auth:session';
export function sessionCookie({ sessionName = DEFAULT_SESSION_COOKIE_NAME, encodeSession, decodeSession }) {
    return ({ cookies, secretKey }) => ({
        clearSession() {
            cookies.set(sessionName, null);
        },
        getSessionToken() {
            return undefined;
        },
        getSession() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const encrypted = (_a = cookies.get(sessionName)) !== null && _a !== void 0 ? _a : '';
                try {
                    const decrypted = decrypt({ encrypted, secretKey });
                    if (decrypted) {
                        const payload = yield decodeSession(JSON.parse(decrypted));
                        return payload;
                    }
                    else {
                        return null;
                    }
                }
                catch (e) {
                    return null; // failed to parse cookie, assume invalid session
                }
            });
        },
        setSession(payload) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield encodeSession(payload);
                const encrypted = encrypt({
                    text: JSON.stringify(data),
                    secretKey
                });
                cookies.set(sessionName, encrypted);
                return encrypted;
            });
        },
    });
}
;
