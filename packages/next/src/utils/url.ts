import { IncomingMessage } from "http";

import type { RequestURL } from "@foo-auth/core";

const basePath: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const getFromMeta = (req: IncomingMessage) => {
  const meta = Object.getOwnPropertySymbols(req).find(
    ({ description }) => description === "NextRequestMeta"
  );

  return meta ? (req as any)[meta]?.__NEXT_INIT_URL ?? null : null;
};

export const getRequestURL = (
  req: IncomingMessage,
  resolvedPathname: string | undefined
): RequestURL | null => {
  const referer = req.headers.referer ?? getFromMeta(req);

  if (referer) {
    const url = new URL(referer);
    const matchBasePathPrefix =
      basePath.length && url.pathname.startsWith(basePath);
    const pathname = matchBasePathPrefix
      ? url.pathname.substring(0, basePath.length)
      : url.pathname;
    const href = resolvedPathname
      ? url.href.substring(0, url.href.lastIndexOf(pathname)) + resolvedPathname
      : url.href;

    return Object.assign<URL, Partial<RequestURL>>(url, {
      href: href,
      basePath: matchBasePathPrefix ? basePath : "",
      pathname: resolvedPathname ?? pathname,
    }) as RequestURL;
  } else {
    return null;
  }
};
