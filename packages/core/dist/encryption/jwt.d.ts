/// <reference types="node" />
import type { JWTPayload, JWTClaimVerificationOptions } from "jose";
import { KeyObject } from "crypto";
export declare function jwtDecode(token: string, secretKey: KeyObject, options: JWTClaimVerificationOptions): Promise<import("jose").JWTVerifyResult | null>;
export declare function jwtEncode(payload: JWTPayload, secretKey: KeyObject, options: JWTClaimVerificationOptions): Promise<string>;
//# sourceMappingURL=jwt.d.ts.map