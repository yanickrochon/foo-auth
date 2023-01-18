
import type { FooAuthEndpointHandlers, FooAuthEndpoints } from '../types';

export function sessionEndpoints<SessionType = any>(endpointPath:FooAuthEndpoints):FooAuthEndpointHandlers<SessionType> {
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