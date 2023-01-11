
import type { FooAuthApiRoutes, FooAuthConfigRoutePrefix } from '../internals';

export function authRoutes<SessionType = any>(baseRoutes:FooAuthConfigRoutePrefix):FooAuthApiRoutes<SessionType> {
  return {
    [baseRoutes.signOut as string]: async ({ res, session }) => {
      await session.clearSession();

      res.status(200).send({
        success:true
      });  
    }
  }
}