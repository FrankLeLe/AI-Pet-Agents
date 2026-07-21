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

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

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

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
