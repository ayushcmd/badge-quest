/**
 * HTML parser for GitHub achievement pages and detail fragments.
 * Uses safe, lightweight regex and string matching designed for Cloudflare Workers runtime.
 */

// Known tier mappings
const TIER_NAME_MAP = {
  "default": { index: 1, name: "Default" },
  "bronze": { index: 2, name: "Bronze" },
  "silver": { index: 3, name: "Silver" },
  "gold": { index: 4, name: "Gold" }
};

/**
 * Parse the user's public achievements page (https://github.com/:username?tab=achievements).
 * @param {string} html 
 * @returns {Array<Object>} List of detected badges with slug, name, tier, and asset url
 */
export function parseAchievementsPage(html) {
  if (!html || typeof html !== "string") return [];

  const detectedMap = new Map();

  // Pattern matches <img> tags with alt="Achievement: ..."
  // Example: <img src=".../pull-shark-bronze-a37accb528d1.png" data-hovercard-url="/users/ayushcmd/achievements/pull-shark/detail?hovercard=1" alt="Achievement: Pull Shark" />
  const imgRegex = /<img[^>]+alt="Achievement:\s*([^"]+)"[^>]*>/gi;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const badgeName = match[1].trim();

    // Extract hovercard URL to get slug
    let slug = null;
    const hovercardMatch = fullTag.match(/data-hovercard-url="\/users\/[^\/]+\/achievements\/([a-z0-9-]+)\/detail/i);
    if (hovercardMatch) {
      slug = hovercardMatch[1].toLowerCase();
    } else {
      // Fallback: derive slug from badge name
      slug = badgeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    // Extract image src
    let src = null;
    const srcMatch = fullTag.match(/src="([^"]+)"/i);
    if (srcMatch) src = srcMatch[1];

    // Extract tier from image filename or class
    let tierIndex = 1;
    let tierName = "Default";

    if (src) {
      const filenameMatch = src.match(/(?:^|\/)[a-z0-9-]+-(default|bronze|silver|gold)(?:--[a-z0-9-]+)?-[a-f0-9]+\.png/i);
      if (filenameMatch) {
        const rawTier = filenameMatch[1].toLowerCase();
        if (TIER_NAME_MAP[rawTier]) {
          tierIndex = TIER_NAME_MAP[rawTier].index;
          tierName = TIER_NAME_MAP[rawTier].name;
        }
      }
    }

    // Save highest tier detected for this slug if multiple images exist
    if (!detectedMap.has(slug) || detectedMap.get(slug).tierIndex < tierIndex) {
      detectedMap.set(slug, {
        slug,
        name: badgeName,
        tierIndex,
        tierName,
        badgeAssetUrl: src
      });
    }
  }

  return Array.from(detectedMap.values());
}

/**
 * Parse an achievement detail fragment (/users/:user/achievements/:slug/detail).
 * @param {string} html 
 * @param {string} slug 
 * @returns {Object} Normalized achievement detail
 */
export function parseAchievementDetail(html, slug) {
  if (!html || typeof html !== "string") {
    return { status: "UNAVAILABLE", error: "Empty response." };
  }

  // 1. Extract tier-count
  let tierCount = 1;
  const tierCountMatch = html.match(/tier-count="(\d+)"/i);
  if (tierCountMatch) {
    tierCount = parseInt(tierCountMatch[1], 10);
  }

  // 2. Extract tier name from label
  let tierName = "Default";
  const tierClassMatch = html.match(/achievement-tier-label--([a-z]+)/i);
  if (tierClassMatch) {
    const rawTier = tierClassMatch[1].toLowerCase();
    if (TIER_NAME_MAP[rawTier]) {
      tierName = TIER_NAME_MAP[rawTier].name;
    }
  } else if (tierCount === 2) {
    tierName = "Bronze";
  } else if (tierCount === 3) {
    tierName = "Silver";
  } else if (tierCount === 4) {
    tierName = "Gold";
  }

  // 3. Extract description
  let description = "";
  const descMatch = html.match(/<div class="mt-1">([^<]+)<\/div>/i);
  if (descMatch) {
    description = descMatch[1].trim();
  }

  // 4. Extract unlocked dates
  let unlockedAt = null;
  const dateMatch = html.match(/<relative-time[^>]+datetime="([^"]+)"/i);
  if (dateMatch) {
    unlockedAt = dateMatch[1];
  }

  // 5. Extract milestones history
  const milestones = [];
  const milestoneRegex = /<div[^>]+class="[^"]*achievement-history-tier[^"]*"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>\s*·\s*<span>([^<]+)<\/span>/gi;
  let mMatch;
  while ((mMatch = milestoneRegex.exec(html)) !== null) {
    milestones.push({
      url: mMatch[1],
      target: mMatch[2].trim(),
      label: mMatch[3].trim()
    });
  }

  return {
    status: "VERIFIED_EARNED",
    slug,
    tierIndex: tierCount,
    tierName,
    description,
    unlockedAt,
    milestones
  };
}
