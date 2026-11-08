/**
 * Cloudflare Cache API & Cache-Control header helper.
 */

const CACHE_TTL_SECONDS = 900; // 15 minutes

export async function matchCache(request) {
  try {
    if (typeof caches !== "undefined" && caches.default) {
      return await caches.default.match(request);
    }
  } catch (err) {
    console.warn("[Cache] Cache match failed:", err.message);
  }
  return null;
}

export async function putCache(request, response, ctx = null) {
  try {
    // Only cache successful 200 responses
    if (response.status === 200 && typeof caches !== "undefined" && caches.default) {
      const responseToCache = response.clone();
      if (ctx && typeof ctx.waitUntil === "function") {
        ctx.waitUntil(caches.default.put(request, responseToCache));
      } else {
        await caches.default.put(request, responseToCache);
      }
    }
  } catch (err) {
    console.warn("[Cache] Cache put failed:", err.message);
  }
}

export function getCacheHeaders(isCached = false) {
  return {
    "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`,
    "X-BadgeQuest-Cache": isCached ? "HIT" : "MISS"
  };
}
