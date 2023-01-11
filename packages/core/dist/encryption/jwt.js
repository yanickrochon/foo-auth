var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SignJWT, jwtVerify } from "jose";
export function jwtDecode(token, secretKey, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return jwtVerify(token, secretKey, options);
        }
        catch (e) {
            return null; // failed to parse cookie, assume invalid session
        }
    });
}
export function jwtEncode(payload, secretKey, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwtSigner = new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' }) // algorithm
            .setIssuedAt();
        if (options.audience) {
            jwtSigner.setAudience(options.audience);
        }
        if (options.issuer) {
            jwtSigner.setIssuer(Array.isArray(options.issuer) ? options.issuer[0] : options.issuer);
        }
        if (options.maxTokenAge) {
            jwtSigner.setExpirationTime(options.maxTokenAge);
        }
        return jwtSigner.sign(secretKey);
    });
}
