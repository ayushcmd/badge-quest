/**
 * Badge Quest — GitHub Public REST API Integration
 * Pure browser-compatible client for GitHub's unauthenticated REST API.
 * 
 * Features:
 * - Strict username validation (RFC / GitHub specs)
 * - Rate limit inspection and live header parsing (x-ratelimit-*)
 * - Session-based in-browser caching (15-min TTL) to conserve rate limit quota
 * - AbortController to cleanly cancel previous in-flight searches
 * - Graceful handling of 404, 403 (rate limits), and network errors
 * - Zero authentication, PAT, or server backend required
 */

window.GitHubAPI = (function () {
  "use strict";

  const API_BASE = "https://api.github.com";
  const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
  const USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

  let activeAbortController = null;

  // Live rate limit state
  const rateLimitState = {
    remaining: 60,
    limit: 60,
    resetTime: null,
    formattedReset: "Normal"
  };

  /**
   * Validate a GitHub username string.
   * @param {string} rawInput 
   * @returns {{ valid: boolean, error?: string, cleanUser?: string }}
   */
  function validateUsername(rawInput) {
    if (!rawInput || typeof rawInput !== "string") {
      return { valid: false, error: "Please enter a GitHub username." };
    }
    const cleanUser = rawInput.trim().replace(/^@/, "");
    if (!cleanUser) {
      return { valid: false, error: "Please enter a valid GitHub username." };
    }
    if (cleanUser.length > 39) {
      return { valid: false, error: "GitHub usernames cannot exceed 39 characters." };
    }
    if (!USERNAME_REGEX.test(cleanUser)) {
      return {
        valid: false,
        error: `"${cleanUser}" is not a valid GitHub username. Usernames may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.`
      };
    }
    return { valid: true, cleanUser };
  }

  /**
   * Parse rate limit response headers.
   * @param {Response} response 
   */
  function updateRateLimitFromHeaders(response) {
    if (!response || !response.headers) return;
    const remaining = response.headers.get("x-ratelimit-remaining");
    const limit = response.headers.get("x-ratelimit-limit");
    const reset = response.headers.get("x-ratelimit-reset");

    if (remaining !== null) rateLimitState.remaining = parseInt(remaining, 10);
    if (limit !== null) rateLimitState.limit = parseInt(limit, 10);
    if (reset !== null) {
      const resetEpoch = parseInt(reset, 10);
      rateLimitState.resetTime = new Date(resetEpoch * 1000);
      rateLimitState.formattedReset = rateLimitState.resetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Dispatch event so UI indicators can update reactively
    try {
      window.dispatchEvent(new CustomEvent("badgequest:ratelimit", { detail: { ...rateLimitState } }));
    } catch (e) {}
  }

  /**
   * Retrieve cached profile from sessionStorage if still fresh.
   * @param {string} cleanUser 
   * @returns {Object|null}
   */
  function getCachedProfile(cleanUser) {
    try {
      const cacheKey = `bq_cache_${cleanUser.toLowerCase()}`;
      const raw = sessionStorage.getItem(cacheKey);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.cachedAt < CACHE_TTL_MS) {
        return data;
      }
      sessionStorage.removeItem(cacheKey);
    } catch (e) {
      console.warn("[GitHubAPI] Cache read failed:", e);
    }
    return null;
  }

  /**
   * Store fetched profile in sessionStorage.
   * @param {string} cleanUser 
   * @param {Object} profile 
   */
  function setCachedProfile(cleanUser, profile) {
    try {
      const cacheKey = `bq_cache_${cleanUser.toLowerCase()}`;
      sessionStorage.setItem(cacheKey, JSON.stringify({
        ...profile,
        cachedAt: Date.now()
      }));
    } catch (e) {
      console.warn("[GitHubAPI] Cache write failed:", e);
    }
  }

  /**
   * Main fetch method for analyzing a GitHub user.
   * @param {string} rawInput 
   * @param {boolean} forceRefresh - If true, bypasses browser cache
   * @returns {Promise<Object>}
   */
  async function fetchProfile(rawInput, forceRefresh = false) {
    const val = validateUsername(rawInput);
    if (!val.valid) {
      throw new Error(val.error);
    }
    const cleanUser = val.cleanUser;

    // Check if test profile requested in test mode (or query parameter)
    if (window.IS_TEST_MODE && window.SAMPLE_PROFILES && window.SAMPLE_PROFILES[cleanUser.toLowerCase()]) {
      return window.buildProfileState(window.SAMPLE_PROFILES[cleanUser.toLowerCase()]);
    }

    // Check browser cache (unless forced refresh)
    if (!forceRefresh) {
      const cached = getCachedProfile(cleanUser);
      if (cached) {
        return {
          ...cached,
          isFromCache: true
        };
      }
    }

    // Cancel any previous search still in flight
    if (activeAbortController) {
      try {
        activeAbortController.abort();
      } catch (e) {}
    }
    activeAbortController = new AbortController();
    const signal = activeAbortController.signal;

    // 1. Fetch User Data
    let userRes;
    try {
      userRes = await fetch(`${API_BASE}/users/${encodeURIComponent(cleanUser)}`, {
        signal,
        headers: { Accept: "application/vnd.github.v3+json" }
      });
    } catch (fetchErr) {
      if (fetchErr.name === "AbortError") {
        throw new Error("Search canceled.");
      }
      throw new Error("Network error connecting to GitHub. Please check your internet connection.");
    }

    updateRateLimitFromHeaders(userRes);

    if (userRes.status === 404) {
      throw new Error(`GitHub user "${cleanUser}" was not found. Please verify the username and try again.`);
    }

    if (userRes.status === 403 || userRes.status === 429) {
      const resetMsg = rateLimitState.formattedReset !== "Normal"
        ? ` It will reset at approximately ${rateLimitState.formattedReset}.`
        : "";
      throw new Error(`GitHub API rate limit exceeded for your IP address (60 requests/hr).${resetMsg} Please wait a few minutes before trying again.`);
    }

    if (!userRes.ok) {
      throw new Error(`GitHub API responded with HTTP ${userRes.status}. Please try again later.`);
    }

    const userData = await userRes.json();

    // 2. Fetch User's Public Repositories (up to 100, sorted by pushed date)
    // Used for Starstruck tier detection and repository overview
    let repos = [];
    if (userData.public_repos > 0) {
      try {
        const reposRes = await fetch(
          `${API_BASE}/users/${encodeURIComponent(cleanUser)}/repos?per_page=100&sort=pushed`,
          { signal, headers: { Accept: "application/vnd.github.v3+json" } }
        );
        updateRateLimitFromHeaders(reposRes);
        if (reposRes.ok) {
          repos = await reposRes.json();
        }
      } catch (repoErr) {
        if (repoErr.name === "AbortError") throw new Error("Search canceled.");
        console.warn("[GitHubAPI] Could not fetch repositories:", repoErr.message);
      }
    }

    // 3. Detect achievements using modular detector
    let detectedAchievements = {};
    if (window.AchievementDetector) {
      try {
        detectedAchievements = await window.AchievementDetector.detectAchievements(userData, repos);
      } catch (detErr) {
        console.warn("[GitHubAPI] Achievement detection warning:", detErr.message);
      }
    }

    // 4. Construct raw profile object
    const rawProfile = {
      username: userData.login,
      name: userData.name || userData.login,
      title: userData.bio || "GitHub Developer",
      avatarUrl: userData.avatar_url,
      profileUrl: userData.html_url,
      repositories: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      createdAt: userData.created_at,
      location: userData.location || null,
      company: userData.company || null,
      blog: userData.blog || null,
      isExample: false,
      isLive: true,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      achievements: detectedAchievements
    };

    const finalState = window.buildProfileState(rawProfile);
    setCachedProfile(cleanUser, finalState);
    return finalState;
  }

  return {
    fetchProfile,
    validateUsername,
    getRateLimitState: () => ({ ...rateLimitState })
  };
})();
