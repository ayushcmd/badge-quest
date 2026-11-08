/**
 * Badge Quest — Hybrid Achievement Detector
 * 
 * Orchestrates achievement detection:
 * 1. Analyzes official GitHub REST API data for Starstruck & repository star metrics.
 * 2. Queries the lightweight Cloudflare Worker backend for publicly exposed GitHub achievement pages.
 * 3. Gracefully falls back to client-side CORS disclosures and direct GitHub profile links if backend is unreachable.
 */

window.AchievementDetector = (function () {
  "use strict";

  // Configurable backend URL
  const DEFAULT_BACKEND_URL = (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
    ? "http://127.0.0.1:8787"
    : "https://badgequest-api.ayushcmd08.workers.dev";

  const BACKEND_URL = (typeof window !== "undefined" && window.BADGE_QUEST_BACKEND_URL) || DEFAULT_BACKEND_URL;

  /**
   * Detect achievements from live public GitHub data + optional Worker backend.
   * @param {Object} userData - User profile object from GitHub REST API
   * @param {Array} repos - List of public repositories from GitHub REST API
   * @param {Array} events - List of recent public events (optional)
   * @returns {Object} Mapping of achievement id -> { status, count, tier, meta, confidence, corsRestricted }
   */
  async function detectAchievements(userData, repos = [], events = []) {
    const results = {};

    // 1. STARSTRUCK — Evaluated locally via GitHub Public REST API repository stars
    const starstruckLocal = detectStarstruck(repos);
    results["starstruck"] = starstruckLocal;

    // 2. QUERY CLOUDFLARE WORKER BACKEND (Hybrid Detection)
    let workerSuccess = false;
    if (BACKEND_URL) {
      try {
        const proxyData = await fetchFromProxy(userData.login);
        if (proxyData && proxyData.success && Array.isArray(proxyData.achievements)) {
          workerSuccess = true;

          for (const item of proxyData.achievements) {
            if (item.id === "starstruck") {
              // Merge Starstruck: pick higher tier between local repo stars and detected profile badge
              if (item.status === "VERIFIED_EARNED" && item.earnedTier) {
                const proxyTier = item.earnedTier.index || 1;
                if (proxyTier > starstruckLocal.tier) {
                  results["starstruck"] = {
                    ...starstruckLocal,
                    tier: proxyTier,
                    status: "earned",
                    confidence: "VERIFIED"
                  };
                }
              }
              continue;
            }

            if (item.status === "VERIFIED_EARNED") {
              results[item.id] = {
                status: "earned",
                tier: item.earnedTier ? item.earnedTier.index : 1,
                tierName: item.earnedTier ? item.earnedTier.name : "Default",
                count: item.earnedTier ? item.earnedTier.threshold : null,
                corsRestricted: false,
                confidence: "VERIFIED",
                sourceUrl: item.sourceUrl,
                badgeAssetUrl: item.badgeAssetUrl,
                notes: `Verified earned on public GitHub profile.`
              };
            } else if (item.status === "VERIFIED_NOT_EARNED") {
              results[item.id] = {
                status: "locked",
                tier: 0,
                count: 0,
                corsRestricted: false,
                confidence: "VERIFIED",
                notes: `Verified as not yet unlocked on profile.`
              };
            } else if (item.status === "RETIRED") {
              results[item.id] = {
                status: "retired",
                tier: 0,
                count: 0,
                corsRestricted: false,
                confidence: "OFFICIAL_THRESHOLD",
                notes: item.reason || "Historical event ended."
              };
            } else if (item.status === "DISABLED") {
              results[item.id] = {
                status: "disabled",
                tier: 0,
                count: 0,
                corsRestricted: false,
                confidence: "OFFICIAL_THRESHOLD",
                notes: item.reason || "Feature disabled by GitHub."
              };
            } else if (item.status === "INTERNAL") {
              results[item.id] = {
                status: "internal",
                tier: 0,
                count: 0,
                corsRestricted: false,
                confidence: "OFFICIAL_THRESHOLD",
                notes: item.reason || "Internal GitHub Staff only."
              };
            } else if (item.status === "NOT_DETECTED") {
              results[item.id] = {
                status: "unavailable",
                tier: null,
                count: null,
                corsRestricted: false,
                confidence: "UNAVAILABLE",
                notes: item.reason || "Profile achievements hidden or none detected."
              };
            }
          }

          return results;
        }
      } catch (err) {
        console.warn("[AchievementDetector] Backend Worker query note:", err.message);
      }
    }

    // 3. FALLBACK TO PURE CLIENT-SIDE MODE IF WORKER UNREACHABLE
    // Honestly discloses browser CORS boundaries on static sites
    const earnableRestricted = [
      "pull-shark",
      "pair-extraordinaire",
      "galaxy-brain",
      "quickdraw",
      "yolo",
      "public-sponsor",
      "finishing-touch"
    ];

    for (const id of earnableRestricted) {
      if (!results[id]) {
        results[id] = {
          status: "unsupported",
          count: null,
          tier: null,
          corsRestricted: true,
          reason: "Direct browser access restricted by GitHub CORS policy on static sites. Official verification requires viewing profile on GitHub.",
          profileTabUrl: `https://github.com/${encodeURIComponent(userData.login)}?tab=achievements`
        };
      }
    }

    const historicalBadges = [
      "arctic-code-vault-contributor",
      "mars-2020-contributor",
      "heart-on-your-sleeve",
      "open-sourcerer"
    ];

    for (const id of historicalBadges) {
      if (!results[id]) {
        results[id] = {
          status: "unsupported",
          count: null,
          tier: null,
          corsRestricted: true,
          reason: "Historical or disabled badge. Requires GitHub profile achievement view.",
          profileTabUrl: `https://github.com/${encodeURIComponent(userData.login)}?tab=achievements`
        };
      }
    }

    const staffBadges = [
      "proxima-pioneer",
      "proxima-staffshipper",
      "proxima-staffuser"
    ];

    for (const id of staffBadges) {
      if (!results[id]) {
        results[id] = {
          status: "unsupported",
          count: null,
          tier: null,
          corsRestricted: true,
          reason: "Internal GitHub Staff achievement only.",
          profileTabUrl: `https://github.com/${encodeURIComponent(userData.login)}?tab=achievements`
        };
      }
    }

    return results;
  }

  /**
   * Starstruck detection logic:
   * Analyzes all public repositories owned by the user.
   * Starstruck requires stars on a single repository:
   * x1: 16 | x2: 128 | x3: 512 | x4: 4,096
   */
  function detectStarstruck(repos) {
    let maxStars = 0;
    let bestRepo = null;

    if (Array.isArray(repos) && repos.length > 0) {
      for (const repo of repos) {
        const stars = repo.stargazers_count || 0;
        if (stars > maxStars) {
          maxStars = stars;
          bestRepo = repo;
        }
      }
    }

    let tier = 0;
    let status = "locked";

    if (maxStars >= 4096) {
      tier = 4;
      status = "earned";
    } else if (maxStars >= 512) {
      tier = 3;
      status = "earned";
    } else if (maxStars >= 128) {
      tier = 2;
      status = "earned";
    } else if (maxStars >= 16) {
      tier = 1;
      status = "earned";
    } else if (maxStars > 0) {
      tier = 0;
      status = "in-progress";
    } else {
      tier = 0;
      status = "locked";
    }

    return {
      status,
      count: maxStars,
      tier,
      corsRestricted: false,
      confidence: "Verified via GitHub REST API",
      bestRepoName: bestRepo ? bestRepo.name : null,
      bestRepoUrl: bestRepo ? bestRepo.html_url : null,
      notes: bestRepo
        ? `Top repository "${bestRepo.name}" has ${maxStars.toLocaleString()} star${maxStars === 1 ? "" : "s"}.`
        : "No starred public repositories found."
    };
  }

  /**
   * Query backend Worker.
   */
  async function fetchFromProxy(username) {
    if (!BACKEND_URL) return null;
    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    const url = `${cleanUrl}/api/analyze/${encodeURIComponent(username)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const resp = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" }
      });
      clearTimeout(timeoutId);
      if (!resp.ok) {
        throw new Error(`Worker responded with HTTP ${resp.status}`);
      }
      return await resp.json();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  return {
    detectAchievements,
    detectStarstruck,
    getBackendUrl: () => BACKEND_URL,
    setBackendUrl: (url) => { window.BADGE_QUEST_BACKEND_URL = url; }
  };
})();
