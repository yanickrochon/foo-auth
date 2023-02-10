import Cookies from "cookies";

const REDIRECT_COOKIE = "foo-auth:redirect";

type Redirect = string | null | undefined;

export function setRedirect(url: Redirect, cookies: Cookies) {
  cookies.set(REDIRECT_COOKIE, url);
}

export function getRedirect(cookies: Cookies) {
  return cookies.get(REDIRECT_COOKIE);
}
