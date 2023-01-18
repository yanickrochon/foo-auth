import type {
  FooAuthEndpointHandlers,
  FooAuthEndpoints,
  //FooAuthEndpointOptions,
  //FooAuthApiSessionResponse
} from '../types';

export function sessionEndpoints<SessionType>({ session }:FooAuthEndpoints):FooAuthEndpointHandlers<SessionType> {
  //  FooAuthApiSessionResponse<SessionType>
  return {
    [session]: async ({ res, session }) => {
      const sessionToken = await session.getSessionToken();
      const sessionValue = await session.getSession();

      res.status(200).send({
       success:true,
       token:sessionToken,
       session:sessionValue
      } as any);  
    }
  }
}