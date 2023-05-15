import { IncomingMessage } from "http";

import type { RequestURL } from "@foo-auth/core";

const publicOrigin: string = process.env.NEXT_PUBLIC_ORIGIN ?? 'http://localhost:3000';
const basePathParts: string[] = process.env.NEXT_PUBLIC_BASE_PATH?.split('/').filter(Boolean) ?? [];
const basePath: string = `/${basePathParts.join('/')}${basePathParts.length ? '/' : ''}`;

const pageBasePath = process.env.NEXT_PUBLIC_FOO_AUTH_PATH || `${publicOrigin}${basePath}`;

const getFromMeta = (req: IncomingMessage) => {
  const meta = Object.getOwnPropertySymbols(req).find(
    ({ description }) => description === "NextRequestMeta"
  );

  return meta ? (req as any)[meta]?.__NEXT_INIT_URL ?? null : null;
};

const getBasePath = (url:URL) => {
  let foundBasePath = '/';

  if (url.origin === publicOrigin) {
    const pathParts = url.pathname.split('\\').filter(Boolean);
    let match = pathParts.length === basePathParts.length;

    for (let i = 0, len = pathParts.length; match && i < len; ++i) {
      if (pathParts[i] !== basePathParts[i]) {
        match = false;
      }
    }

    if (match) {
      foundBasePath = basePath;
    }
  }

  return foundBasePath;
}

/**
 * The prupose of this function is to return a fully qualified URL from
 * the current IncomingMessage. If the resolvedPathname is provided, it 
 * should be the suffix of the URI being resolved, in case when Next.js
 * is being mounted inside a subpath.
 */
export const getRequestURL = (
  req: IncomingMessage,
  resolvedPathname: string | undefined
): RequestURL => {
  const referer = req.headers.referer ?? getFromMeta(req) ?? `${publicOrigin}${req.url ?? '/'}`;
  const url = new URL(referer);
  const basePath = getBasePath(url);
  const resolvedPath = resolvedPathname?.replace(/^\//, '') ?? '';
  const newURL = Object.assign<URL, Partial<RequestURL>>(
    new URL(
      `${url.origin}${basePath}${resolvedPath}`
    ),
    {
      search: url.search,
      basePath,
    }
  ) as RequestURL;

  return newURL;
};

/**
 * Function used to return page URL
 */
export const getPageURL = (pagePath:string) => new URL(`${pageBasePath}${pagePath}`.replace(/\/\//g, '/'));