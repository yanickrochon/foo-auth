
import type { FooAuthEndpoints, FooAuthEndpointsConfig } from '../internals';

export function sessionEndpoints<SessionType = any>(endpointPath:FooAuthEndpointsConfig):FooAuthEndpoints<SessionType> {
  return {
    [endpointPath.session as string]: async ({ res, session }) => {
      const sessionToken = await session.getSessionToken();
      const sessionValue = await session.getSession();

      res.status(200).send({
        success:true,
        token:sessionToken,
        session:sessionValue
      });  
    }
  }
}