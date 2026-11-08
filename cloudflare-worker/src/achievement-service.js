/**
 * Achievement Service: Normalizes detected GitHub achievement data against the 15-item catalogue.
 */

import { fetchUserAchievementsPage, fetchAchievementDetail } from "./github.js";
import { parseAchievementsPage, parseAchievementDetail } from "./achievement-parser.js";

// Canonical Catalogue & Tier Thresholds
const CATALOGUE = [
  {
    id: "pull-shark",
    name: "Pull Shark",
    category: "earnable",
    tiers: [
      { index: 1, name: "Default", threshold: 2 },
      { index: 2, name: "Bronze", threshold: 16 },
      { index: 3, name: "Silver", threshold: 128 },
      { index: 4, name: "Gold", threshold: 1024 }
    ],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "starstruck",
    name: "Starstruck",
    category: "earnable",
    tiers: [
      { index: 1, name: "Default", threshold: 16 },
      { index: 2, name: "Bronze", threshold: 128 },
      { index: 3, name: "Silver", threshold: 512 },
      { index: 4, name: "Gold", threshold: 4096 }
    ],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "pair-extraordinaire",
    name: "Pair Extraordinaire",
    category: "earnable",
    tiers: [
      { index: 1, name: "Default", threshold: 1 },
      { index: 2, name: "Bronze", threshold: 10 },
      { index: 3, name: "Silver", threshold: 24 },
      { index: 4, name: "Gold", threshold: 48 }
    ],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "galaxy-brain",
    name: "Galaxy Brain",
    category: "earnable",
    tiers: [
      { index: 1, name: "Default", threshold: 2 },
      { index: 2, name: "Bronze", threshold: 8 },
      { index: 3, name: "Silver", threshold: 16 },
      { index: 4, name: "Gold", threshold: 32 }
    ],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "finishing-touch",
    name: "Finishing Touch",
    category: "earnable",
    tiers: [
      { index: 1, name: "Default", threshold: 1 },
      { index: 2, name: "Bronze", threshold: 4 },
      { index: 3, name: "Silver", threshold: 16 },
      { index: 4, name: "Gold", threshold: 32 }
    ],
    confidence: "COMMUNITY_OBSERVED"
  },
  {
    id: "quickdraw",
    name: "Quickdraw",
    category: "earnable",
    tiers: [{ index: 1, name: "Default", threshold: 1 }],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "yolo",
    name: "YOLO",
    category: "earnable",
    tiers: [{ index: 1, name: "Default", threshold: 1 }],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "public-sponsor",
    name: "Public Sponsor",
    category: "earnable",
    tiers: [{ index: 1, name: "Default", threshold: 1 }],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "heart-on-your-sleeve",
    name: "Heart On Your Sleeve",
    category: "disabled",
    tiers: [],
    confidence: "UNAVAILABLE"
  },
  {
    id: "open-sourcerer",
    name: "Open Sourcerer",
    category: "disabled",
    tiers: [],
    confidence: "UNAVAILABLE"
  },
  {
    id: "arctic-code-vault-contributor",
    name: "Arctic Code Vault Contributor",
    category: "retired",
    tiers: [{ index: 1, name: "Default", threshold: 1 }],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "mars-2020-contributor",
    name: "Mars 2020 Contributor",
    category: "retired",
    tiers: [{ index: 1, name: "Default", threshold: 1 }],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "proxima-pioneer",
    name: "Proxima Pioneer",
    category: "internal",
    tiers: [{ index: 1, name: "Default", threshold: 1 }],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "proxima-staffshipper",
    name: "Proxima Staffshipper",
    category: "internal",
    tiers: [{ index: 1, name: "Default", threshold: 1 }],
    confidence: "OFFICIAL_THRESHOLD"
  },
  {
    id: "proxima-staffuser",
    name: "Proxima Staffuser",
    category: "internal",
    tiers: [{ index: 1, name: "Default", threshold: 1 }],
    confidence: "OFFICIAL_THRESHOLD"
  }
];

export async function getUserAchievements(username) {
  const ghRes = await fetchUserAchievementsPage(username);

  // When GitHub returns 404, the user's achievements tab is either hidden or empty
  const hasPublicAchievements = ghRes.ok && ghRes.status === 200;
  const rawDetected = hasPublicAchievements ? parseAchievementsPage(ghRes.html) : [];
  const detectedMap = new Map(rawDetected.map(d => [d.slug, d]));

  const normalizedAchievements = CATALOGUE.map(item => {
    const detected = detectedMap.get(item.id);

    if (detected) {
      // Achievement is VERIFIED_EARNED
      const earnedTierIndex = detected.tierIndex || 1;
      const earnedTierName = detected.tierName || "Default";

      // Compute next tier strictly: if x1 earned, next is x2 Bronze
      let nextTier = null;
      if (item.tiers.length > 0 && earnedTierIndex < item.tiers.length) {
        nextTier = {
          index: item.tiers[earnedTierIndex].index,
          name: item.tiers[earnedTierIndex].name,
          threshold: item.tiers[earnedTierIndex].threshold
        };
      }

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        status: "VERIFIED_EARNED",
        earnedTier: {
          index: earnedTierIndex,
          name: earnedTierName
        },
        nextTier,
        progress: null, // Numerical progress unavailable from tab page unless detail is fetched
        confidence: "VERIFIED",
        sourceUrl: `https://github.com/${encodeURIComponent(username)}?tab=achievements`,
        badgeAssetUrl: detected.badgeAssetUrl || null
      };
    }

    // Badge was NOT detected on user's page
    if (item.category === "disabled") {
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        status: "DISABLED",
        earnedTier: null,
        nextTier: null,
        progress: null,
        confidence: "OFFICIAL_THRESHOLD",
        sourceUrl: `https://github.com/${encodeURIComponent(username)}?tab=achievements`,
        reason: "Achievement feature disabled by GitHub."
      };
    }

    if (item.category === "retired") {
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        status: "RETIRED",
        earnedTier: null,
        nextTier: null,
        progress: null,
        confidence: "OFFICIAL_THRESHOLD",
        sourceUrl: `https://github.com/${encodeURIComponent(username)}?tab=achievements`,
        reason: "Historical event concluded."
      };
    }

    if (item.category === "internal") {
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        status: "INTERNAL",
        earnedTier: null,
        nextTier: null,
        progress: null,
        confidence: "OFFICIAL_THRESHOLD",
        sourceUrl: `https://github.com/${encodeURIComponent(username)}?tab=achievements`,
        reason: "Reserved for GitHub internal staff."
      };
    }

    // Earnable badge
    if (hasPublicAchievements) {
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        status: "VERIFIED_NOT_EARNED",
        earnedTier: null,
        nextTier: item.tiers.length > 0 ? {
          index: item.tiers[0].index,
          name: item.tiers[0].name,
          threshold: item.tiers[0].threshold
        } : null,
        progress: null,
        confidence: "VERIFIED",
        sourceUrl: `https://github.com/${encodeURIComponent(username)}?tab=achievements`
      };
    }

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      status: "NOT_DETECTED",
      earnedTier: null,
      nextTier: item.tiers.length > 0 ? {
        index: item.tiers[0].index,
        name: item.tiers[0].name,
        threshold: item.tiers[0].threshold
      } : null,
      progress: null,
      confidence: "UNAVAILABLE",
      sourceUrl: `https://github.com/${encodeURIComponent(username)}?tab=achievements`,
      reason: "Profile achievements hidden or no public achievements unlocked."
    };
  });

  return {
    success: true,
    username,
    source: "github-public-achievement-pages",
    hasPublicAchievements,
    lastUpdated: new Date().toISOString(),
    achievements: normalizedAchievements,
    metadata: {
      method: "public-page-parsing",
      unofficial: true,
      earnableCount: normalizedAchievements.filter(a => a.category === "earnable" && a.status === "VERIFIED_EARNED").length,
      totalEarnable: 8,
      limitations: [
        "GitHub does not provide a dedicated official achievements API.",
        "Achievement visibility requires user to have enabled 'Show Achievements on profile' in GitHub settings."
      ]
    }
  };
}

export async function getSingleAchievementDetail(username, slug) {
  const ghRes = await fetchAchievementDetail(username, slug);
  if (!ghRes.ok) {
    if (ghRes.status === 404) {
      return {
        success: true,
        username,
        slug,
        status: "VERIFIED_NOT_EARNED",
        reason: "Achievement not unlocked on this profile."
      };
    }
    return {
      success: false,
      username,
      slug,
      status: "UNAVAILABLE",
      httpStatus: ghRes.status,
      error: ghRes.error || "Could not retrieve achievement detail."
    };
  }

  const parsed = parseAchievementDetail(ghRes.html, slug);
  return {
    success: true,
    username,
    ...parsed,
    sourceUrl: ghRes.url,
    lastUpdated: new Date().toISOString()
  };
}
