var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jwtEncode, jwtDecode } from '../encryption/jwt';
export const JWT_HEADER_NAME = 'Authorization';
export function sessionCookie({ issuer, audience, maxTokenAge, encodeSession, decodeSession }) {
    const getToken = (req) => {
        const token = req.headers[JWT_HEADER_NAME];
        if (token) {
            return token.replace('Bearer ', '');
        }
        else {
            return undefined;
        }
    };
    return ({ req, secretKey }) => ({
        clearSession() {
            /* nothing */
        },
        getSessionToken() {
            return getToken(req);
        },
        getSession() {
            return __awaiter(this, void 0, void 0, function* () {
                const token = getToken(req);
                if (token) {
                    const result = yield jwtDecode(token, secretKey, { issuer, audience });
                    if (result === null || result === void 0 ? void 0 : result.payload) {
                        const payload = yield decodeSession(result.payload);
                        return payload;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return null;
                }
            });
        },
        setSession(payload) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield encodeSession(payload);
                return jwtEncode(data, secretKey, { issuer, audience, maxTokenAge });
            });
        },
    });
}
;
