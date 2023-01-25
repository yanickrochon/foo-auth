import {
  verifyCSRFToken,
  jwtEncode,
  jwtDecode,

  type FooAuthEndpoints,
  type FooAuthProvider
} from "@foo-auth/core";


export type CredentialsOptions<Credentials, SessionType = any> = {
  name?:string;
  authenticate(credentials:Credentials):SessionType | null | PromiseLike<SessionType | null>;
  maxTokenAge:string;
};

const DEFAULT_NAME = "email";


export function email<Credentials, SessionType>({
  name = DEFAULT_NAME,
  authenticate,
  maxTokenAge
}:CredentialsOptions<Credentials, SessionType>):FooAuthProvider<SessionType> {
  return (endpointPath:FooAuthEndpoints) => ({
    [`${endpointPath.signIn}/${name}`]: async ({ req, res, session, secretKey }) => {
      const { csrfToken, ...credentials } = req.body;
      const { r:redirect } = req.query;
      const token = Array.isArray(csrfToken) ? csrfToken.join('') : csrfToken as string;

      if (verifyCSRFToken({ token })) {
        const sessionValue = await authenticate(credentials as Credentials);

        if (sessionValue) {
          const emailToken = jwtEncode({ sessionValue, redirect }, secretKey, { maxTokenAge });

          console.log("Email validation token:", emailToken );

          // if (redirect) {
          //   res.redirect(307, Array.isArray(redirect) ? redirect[0] : redirect);
          // } else {

          //   res.status(200).send({
          //     success: true,
          //     session: sessionValue,
          //     token
          //   } as any);
          // }
        } else {
          res.status(403).end();
        }
      } else {
        res.status(401).end();
      }
    },
    [`${endpointPath.signIn}/${name}/verify/:emailToken`]: async ({ req, res, session, secretKey }) => {
      const { emailToken } = req.query;

      if (emailToken) {
        try {
          const token = Array.isArray(emailToken) ? emailToken.join('') : emailToken ?? '';

          const { sessionValue, redirect } = jwtDecode(token, secretKey) as any ?? {};

          if (sessionValue) {
            const token = await session.setSession(sessionValue);

            if (redirect) {
              // TODO : if JWT, add token to redirect!!

              res.redirect(307, Array.isArray(redirect) ? redirect[0] : redirect);
            } else {
              // TODO : email should redirect somewhere!

              res.status(200).send({
                success: true,
                session: sessionValue,
                token
              } as any);
            }
          } else {
            res.status(401).end();
          }
        } catch (err) {
          res.status(403).end();
        }
      } else {
        res.status(401).end();
      }
    }
  });
};