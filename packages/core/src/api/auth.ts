
import type { FooAuthEndpoints, FooAuthEndpointsConfig } from '../internals';

export function authEndpoints<SessionType = any>(endpointPath:FooAuthEndpointsConfig):FooAuthEndpoints<SessionType> {
  return {
    [endpointPath.signOut as string]: async ({ res, session }) => {
      await session.clearSession();

      res.status(200).send({
        success:true
      });  
    }
  }
}