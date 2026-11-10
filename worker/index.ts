/** Cloudflare Worker entry point for the vinext application. */
import handler from "vinext/server/app-router-entry";
import { getPetRelease, getPetReleaseCommit } from "../lib/pet-releases";

interface Env {
  ASSETS: Fetcher;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type ByteRange = {
  end: number;
  start: number;
};

type HtmlRewriterElement = {
  setAttribute(name: string, value: string): void;
};

type HtmlRewriterConstructor = new () => {
  on(
    selector: string,
    handlers: { element(element: HtmlRewriterElement): void },
  ): { transform(response: Response): Response };
};

const HSTS_VALUE = "max-age=31536000; includeSubDomains";
const HATCH_SKILL_RELEASE = "6bfce72ca689966918c3bb85c68007914a27f54c";
const DOWNLOAD_BROWSER_CACHE = "public, max-age=0, must-revalidate";
const DOWNLOAD_EDGE_CACHE =
  "public, max-age=604800, stale-while-revalidate=2592000, stale-if-error=2592000";
const VERSIONED_DOWNLOAD_CACHE = "public, max-age=31536000, immutable";

type DownloadTarget = {
  filename: string;
  versioned: boolean;
};

function resolveDownloadTarget(pathname: string): DownloadTarget | null {
  const legacyMatch = /^\/downloads\/([a-z0-9][a-z0-9-]*\.zip)$/.exec(pathname);
  if (legacyMatch) {
    return { filename: legacyMatch[1], versioned: false };
  }

  const versionedMatch =
    /^\/downloads\/([0-9a-f]{40})\/([a-z0-9][a-z0-9-]*\.zip)$/.exec(pathname);
  if (!versionedMatch) return null;
  const petId = versionedMatch[2].slice(0, -4);
  const isPetRelease =
    Boolean(getPetRelease(petId)) &&
    versionedMatch[1] === getPetReleaseCommit(petId);
  const isHatchRelease =
    versionedMatch[1] === HATCH_SKILL_RELEASE &&
    versionedMatch[2] === "hatch-pet.zip";
  if (!isPetRelease && !isHatchRelease) return null;

  return { filename: versionedMatch[2], versioned: true };
}

function parseByteRange(value: string, size: number): ByteRange | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match || (!match[1] && !match[2]) || size <= 0) return null;

  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return null;
    return { start: Math.max(size - suffixLength, 0), end: size - 1 };
  }

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(requestedEnd) ||
    start < 0 ||
    start >= size ||
    requestedEnd < start
  ) {
    return null;
  }

  return { start, end: Math.min(requestedEnd, size - 1) };
}

function ifRangeMatches(value: string | null, headers: Headers): boolean {
  if (!value) return true;
  const etag = headers.get("etag");
  return Boolean(etag && !etag.startsWith("W/") && value.trim() === etag);
}

function sliceByteStream(
  stream: ReadableStream<Uint8Array>,
  range: ByteRange,
): ReadableStream<Uint8Array> {
  let offset = 0;

  return stream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const chunkStart = offset;
        const chunkEnd = chunkStart + chunk.byteLength - 1;

        if (chunkEnd >= range.start && chunkStart <= range.end) {
          const start = Math.max(range.start - chunkStart, 0);
          const end = Math.min(range.end - chunkStart + 1, chunk.byteLength);
          controller.enqueue(chunk.subarray(start, end));
        }

        offset += chunk.byteLength;
        if (offset > range.end) controller.terminate();
      },
    }),
  );
}

async function serveDownload(request: Request, env: Env): Promise<Response> {
  const requestUrl = new URL(request.url);
  const target = resolveDownloadTarget(requestUrl.pathname);
  if (!target) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "Cache-Control": "private, no-store",
        "Strict-Transport-Security": HSTS_VALUE,
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const assetUrl = new URL(request.url);
  assetUrl.pathname = `/downloads/${target.filename}`;
  assetUrl.search = "";
  const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, request));
  if (!assetResponse.ok) {
    const missingHeaders = new Headers(assetResponse.headers);
    missingHeaders.set("Cache-Control", "private, no-store");
    missingHeaders.delete("Cloudflare-CDN-Cache-Control");
    missingHeaders.set("Strict-Transport-Security", HSTS_VALUE);
    missingHeaders.set("X-Content-Type-Options", "nosniff");
    return new Response(request.method === "HEAD" ? null : assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers: missingHeaders,
    });
  }

  const headers = new Headers(assetResponse.headers);
  const cachePolicy = target.versioned
    ? VERSIONED_DOWNLOAD_CACHE
    : DOWNLOAD_BROWSER_CACHE;
  const edgeCachePolicy = target.versioned
    ? VERSIONED_DOWNLOAD_CACHE
    : DOWNLOAD_EDGE_CACHE;
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", cachePolicy);
  headers.set("Cloudflare-CDN-Cache-Control", edgeCachePolicy);
  headers.set("Content-Disposition", `attachment; filename="${target.filename}"`);
  headers.set("Strict-Transport-Security", HSTS_VALUE);
  headers.set("X-Content-Type-Options", "nosniff");

  const rangeHeader = request.headers.get("range");
  if (!rangeHeader || request.method === "HEAD" || assetResponse.status === 206) {
    return new Response(request.method === "HEAD" ? null : assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  }

  const size = Number(headers.get("content-length"));
  if (
    !Number.isSafeInteger(size) ||
    size <= 0 ||
    !assetResponse.body ||
    !ifRangeMatches(request.headers.get("if-range"), headers)
  ) {
    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  }

  const range = parseByteRange(rangeHeader, size);
  if (!range) {
    await assetResponse.body.cancel();
    headers.set("Content-Range", `bytes */${size}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }

  headers.set("Content-Range", `bytes ${range.start}-${range.end}/${size}`);
  headers.set("Content-Length", String(range.end - range.start + 1));
  return new Response(sliceByteStream(assetResponse.body, range), {
    status: 206,
    headers,
  });
}

async function localizeDocumentLanguage(response: Response, language: string): Promise<Response> {
  const Rewriter = (
    globalThis as typeof globalThis & { HTMLRewriter?: HtmlRewriterConstructor }
  ).HTMLRewriter;

  if (Rewriter) {
    return new Rewriter()
      .on("html", {
        element(element) {
          element.setAttribute("lang", language);
        },
      })
      .transform(response);
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  const html = (await response.text()).replace(
    /<html\b([^>]*?)\blang=(['"])[^'"]*\2/i,
    `<html$1lang="${language}"`,
  );

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (
      url.pathname.startsWith("/downloads/") &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return serveDownload(request, env);
    }

    const response = await handler.fetch(request, env, ctx);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return response;
    }

    const headers = new Headers(response.headers);
    const contentType = headers.get("content-type") ?? "";
    const isRscResponse = contentType.includes("text/x-component");
    const isPetAsset =
      url.pathname.startsWith("/pets/") &&
      !contentType.includes("text/html") &&
      !isRscResponse;
    headers.set("Strict-Transport-Security", HSTS_VALUE);

    if (response.ok && isPetAsset) {
      headers.set("Cache-Control", DOWNLOAD_BROWSER_CACHE);
      headers.set("Cloudflare-CDN-Cache-Control", DOWNLOAD_EDGE_CACHE);
    } else if (response.ok && url.pathname.startsWith("/api/v1/")) {
      headers.set("Cache-Control", "public, max-age=300");
      headers.set(
        "Cloudflare-CDN-Cache-Control",
        "public, max-age=3600, stale-while-revalidate=86400, stale-if-error=86400",
      );
    } else if (
      response.ok &&
      (contentType.includes("text/html") || isRscResponse)
    ) {
      headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      headers.set(
        "Cloudflare-CDN-Cache-Control",
        "public, max-age=3600, stale-while-revalidate=86400, stale-if-error=86400",
      );
    } else if (
      response.ok &&
      (url.pathname === "/robots.txt" || url.pathname === "/sitemap.xml")
    ) {
      headers.set("Cache-Control", "public, max-age=3600");
      headers.set(
        "Cloudflare-CDN-Cache-Control",
        "public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800",
      );
    } else {
      headers.set("Cache-Control", "private, no-store");
      headers.delete("Cloudflare-CDN-Cache-Control");
    }

    const finalResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    if (response.ok && contentType.includes("text/html")) {
      return localizeDocumentLanguage(
        finalResponse,
        url.searchParams.get("lang") === "en" ? "en" : "zh-CN",
      );
    }

    return finalResponse;
  },
};

export default worker;
