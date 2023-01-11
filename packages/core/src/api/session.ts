
import type { FooAuthApiRoutes, FooAuthConfigRoutePrefix } from '../internals';

export function sessionRoutes<SessionType = any>(baseRoutes:FooAuthConfigRoutePrefix):FooAuthApiRoutes<SessionType> {
  return {
    [baseRoutes.session as string]: async ({ res, session }) => {
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