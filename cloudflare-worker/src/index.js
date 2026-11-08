/**
 * Badge Quest — Cloudflare Worker API
 * 
 * Provides server-side retrieval and normalization of public GitHub achievements.
 * Fully compatible with GitHub Pages static frontend.
 */

import { validateUsername, validateSlug } from "./validation.js";
import { getUserAchievements, getSingleAchievementDetail } from "./achievement-service.js";
import { matchCache, putCache, getCacheHeaders } from "./cache.js";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://ayushcmd.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
];

function getCorsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const configured = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : DEFAULT_ALLOWED_ORIGINS;

  let allowOrigin = configured[0];
  if (origin && (configured.includes(origin) || configured.includes("*") || origin.endsWith(".github.io"))) {
    allowOrigin = origin;
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, X-Requested-With",
    "Access-Control-Max-Age": "86400"
  };
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    const cors = getCorsHeaders(request, env);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed. Use GET." }, 405, cors);
    }

    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, "");

    // 1. Health Endpoint: /api/health
    if (pathname === "/api/health" || pathname === "/health") {
      return jsonResponse({
        status: "healthy",
        service: "badgequest-api",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        environment: env.ENVIRONMENT || "production"
      }, 200, cors);
    }

    // 2. Check Cache for data endpoints
    const cachedResponse = await matchCache(request);
    if (cachedResponse) {
      const cloned = new Response(cachedResponse.body, cachedResponse);
      Object.entries(cors).forEach(([k, v]) => cloned.headers.set(k, v));
      cloned.headers.set("X-BadgeQuest-Cache", "HIT");
      return cloned;
    }

    // 3. Routing
    try {
      // /api/achievements/:username/:slug
      const detailMatch = pathname.match(/^\/api\/achievements\/([^/]+)\/([^/]+)$/i);
      if (detailMatch) {
        const uVal = validateUsername(detailMatch[1]);
        if (!uVal.valid) return jsonResponse({ error: uVal.error }, 400, cors);

        const sVal = validateSlug(detailMatch[2]);
        if (!sVal.valid) return jsonResponse({ error: sVal.error }, 400, cors);

        const result = await getSingleAchievementDetail(uVal.username, sVal.slug);
        const resp = jsonResponse(result, 200, { ...cors, ...getCacheHeaders(false) });
        await putCache(request, resp, ctx);
        return resp;
      }

      // /api/achievements/:username OR /api/analyze/:username
      const userMatch = pathname.match(/^\/api\/(?:achievements|analyze)\/([^/]+)$/i);
      if (userMatch) {
        const uVal = validateUsername(userMatch[1]);
        if (!uVal.valid) return jsonResponse({ error: uVal.error }, 400, cors);

        const result = await getUserAchievements(uVal.username);
        const resp = jsonResponse(result, 200, { ...cors, ...getCacheHeaders(false) });
        await putCache(request, resp, ctx);
        return resp;
      }

      // Route not found
      return jsonResponse({
        error: "Not Found",
        availableEndpoints: [
          "GET /api/health",
          "GET /api/achievements/:username",
          "GET /api/achievements/:username/:slug",
          "GET /api/analyze/:username"
        ]
      }, 404, cors);

    } catch (err) {
      console.error("[Worker Error]:", err);
      return jsonResponse({
        error: "Internal Worker Error",
        message: err.message || "An unexpected error occurred."
      }, 500, cors);
    }
  }
};
