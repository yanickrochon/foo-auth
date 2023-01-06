
import type { FooAuthApiRoutes, FooAuthConfigRoutePrefix } from '../internals';

export function sessionRoutes<SessionType = any>(baseRoutes:FooAuthConfigRoutePrefix):FooAuthApiRoutes<SessionType> {
  return {
    [baseRoutes.session as string]: ({ res, session }) => {
      const sessionToken = session.getSessionToken();
      const sessionValue = session.getSession();

      res.status(200).send({
        success:true,
        token:sessionToken,
        session:sessionValue
      });  
    }
  }
}