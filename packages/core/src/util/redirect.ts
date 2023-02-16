import type { FooAuthApiRequest } from "../types";

const REDIRECT_COOKIE = "foo-auth:redirect";

type Redirect = string | undefined;

export function clearRedirect(req: FooAuthApiRequest) {
  req.cookies.set(REDIRECT_COOKIE, undefined);
}

export function setRedirect(url: Redirect, req: FooAuthApiRequest) {
  req.cookies.set(REDIRECT_COOKIE, url);
}

export function getRedirect(req: FooAuthApiRequest) {
  return req.cookies.get(REDIRECT_COOKIE);
}
