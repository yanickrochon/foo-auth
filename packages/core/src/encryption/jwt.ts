import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload, JWTClaimVerificationOptions } from "jose";
import { KeyObject } from "crypto";



export async function jwtDecode(token:string, secretKey:KeyObject, options?:JWTClaimVerificationOptions) {
  try {
    return jwtVerify(token, secretKey, options);
  } catch (e) {
    return null; // failed to parse cookie, assume invalid session
  }
}


export async function jwtEncode(payload:JWTPayload, secretKey:KeyObject, options?:JWTClaimVerificationOptions) {
  const jwtSigner = new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // algorithm
    .setIssuedAt()
  ;

  if (options?.audience) {
    jwtSigner.setAudience(options.audience);
  }
  if (options?.issuer) {
    jwtSigner.setIssuer(Array.isArray(options.issuer) ? options.issuer[0] : options.issuer);
  }
  if (options?.maxTokenAge) {
    jwtSigner.setExpirationTime(options.maxTokenAge);  
  }

  return jwtSigner.sign(secretKey);
}