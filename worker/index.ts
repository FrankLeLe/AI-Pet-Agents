/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
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

async function serveDownload(request: Request, env: Env): Promise<Response> {
  const assetResponse = await env.ASSETS.fetch(request);
  const headers = new Headers(assetResponse.headers);

  if (!assetResponse.ok) {
    return assetResponse;
  }

  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.set("Cloudflare-CDN-Cache-Control", "public, max-age=300, must-revalidate");
  headers.set("Strict-Transport-Security", HSTS_VALUE);

  const rangeHeader = request.headers.get("range");
  const ifRangeHeader = request.headers.get("if-range");
  if (
    !rangeHeader ||
    request.method === "HEAD" ||
    assetResponse.status === 206 ||
    (ifRangeHeader && assetResponse.status === 200)
  ) {
    return new Response(request.method === "HEAD" ? null : assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  }

  const body = await assetResponse.arrayBuffer();
  const range = parseByteRange(rangeHeader, body.byteLength);

  if (!range) {
    headers.set("Content-Range", `bytes */${body.byteLength}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }

  const partialBody = body.slice(range.start, range.end + 1);
  headers.set("Content-Range", `bytes ${range.start}-${range.end}/${body.byteLength}`);
  headers.set("Content-Length", String(partialBody.byteLength));

  return new Response(partialBody, { status: 206, headers });
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

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const isLocalHost = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

    if (url.protocol === "http:" && !isLocalHost) {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 308);
    }

    if (
      url.pathname.startsWith("/downloads/") &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return serveDownload(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const response = await handler.fetch(request, env, ctx);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return response;
    }

    const headers = new Headers(response.headers);
    const contentType = headers.get("content-type") ?? "";
    const isPetAsset = url.pathname.startsWith("/pets/") && !contentType.includes("text/html");
    headers.set("Strict-Transport-Security", HSTS_VALUE);

    if (response.ok && (isPetAsset || url.pathname.startsWith("/downloads/"))) {
      headers.set("Cache-Control", "public, max-age=604800, stale-while-revalidate=2592000");
    } else if (response.ok && url.pathname.startsWith("/api/v1/")) {
      headers.set("Cache-Control", "public, max-age=300");
      headers.set(
        "Cloudflare-CDN-Cache-Control",
        "public, max-age=3600, stale-while-revalidate=86400, stale-if-error=86400",
      );
    } else if (
      response.ok &&
      (contentType.includes("text/html") ||
        contentType.includes("text/x-component"))
    ) {
      headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      headers.set(
        "Cloudflare-CDN-Cache-Control",
        "public, max-age=300, stale-while-revalidate=86400, stale-if-error=86400",
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
