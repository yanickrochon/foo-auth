
import type { FooAuthApiRoutes, FooAuthConfigRoutePrefix } from '../internals';

export function sessionRoutes<SessionType = any>(baseRoutes:FooAuthConfigRoutePrefix):FooAuthApiRoutes<SessionType> {
  return {
    [baseRoutes.session as string]: ({ res, session }) => {
      const sessionValue = session.getSession();

      // TODO : return session token

      res.status(200).send({
        success:true,
        session:sessionValue
      });  
    }
  }
}