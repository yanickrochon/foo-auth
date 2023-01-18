
import type { FooAuthEndpointHandlers, FooAuthEndpoints } from '../types';

export function authEndpoints<SessionType = any>(endpointPath:FooAuthEndpoints):FooAuthEndpointHandlers<SessionType> {
  return {
    [endpointPath.signOut as string]: async ({ res, session }) => {
      await session.clearSession();

      res.status(200).send({
        success:true
      });  
    }
  }
}