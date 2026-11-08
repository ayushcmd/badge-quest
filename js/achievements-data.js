/**
 * Badge Quest — Full GitHub Achievement Catalogue & Multi-Tier Engine
 * Authoritative, centralized definition of all GitHub achievements, tiers,
 * historical badges, internal badges, and profile badges.
 */

window.ACHIEVEMENT_CATALOGUE = [
  // =========================================================================
  // A. Currently Earnable Achievements (8 items)
  // =========================================================================
  {
    id: "pull-shark",
    name: "Pull Shark",
    category: "earnable",
    availability: "Currently Earnable",
    description: "Opened pull requests that have been reviewed and successfully merged.",
    officialRule: "Opened pull requests that get merged into the parent repository default branch.",
    confidence: "Official threshold",
    confidenceDetails: "Explicitly documented and verified by GitHub achievement release guidelines.",
    isOneTime: false,
    tiers: [
      { tier: 1, name: "Default", threshold: 2, label: "2 merged PRs", badgeImg: "assets/badges/PullShark.png" },
      { tier: 2, name: "Bronze", threshold: 16, label: "16 merged PRs", badgeImg: "assets/badges/PullShark_Bronze.png" },
      { tier: 3, name: "Silver", threshold: 128, label: "128 merged PRs", badgeImg: "assets/badges/PullShark_Silver.png" },
      { tier: 4, name: "Gold", threshold: 1024, label: "1,024 merged PRs", badgeImg: "assets/badges/PullShark_Gold.png" }
    ],
    metricName: "qualifying merged PRs",
    borderColor: "rgba(56, 189, 248, 0.45)",
    glowColor: "rgba(56, 189, 248, 0.2)",
    tip: "Only pull requests that have been merged count. Open, closed-unmerged, or draft PRs do not qualify. Genuine open-source and collaborative pull requests are recommended."
  },
  {
    id: "starstruck",
    name: "Starstruck",
    category: "earnable",
    availability: "Currently Earnable",
    description: "Created a repository that reached a milestone star count.",
    officialRule: "A single repository created and owned by the user receives stars from GitHub accounts.",
    confidence: "Official threshold",
    confidenceDetails: "Documented by GitHub. Counted per single repository (not aggregate stars across multiple repos).",
    isOneTime: false,
    tiers: [
      { tier: 1, name: "Default", threshold: 16, label: "16 stars on single repo", badgeImg: "assets/badges/Starstruck.png" },
      { tier: 2, name: "Bronze", threshold: 128, label: "128 stars on single repo", badgeImg: "assets/badges/StarStruck_Bronze.png" },
      { tier: 3, name: "Silver", threshold: 512, label: "512 stars on single repo", badgeImg: "assets/badges/StarStruck_Silver.png" },
      { tier: 4, name: "Gold", threshold: 4096, label: "4,096 stars on single repo", badgeImg: "assets/badges/StarStruck_Gold.png" }
    ],
    metricName: "stars on highest repository",
    borderColor: "rgba(250, 204, 21, 0.45)",
    glowColor: "rgba(250, 204, 21, 0.2)",
    tip: "Starstruck requires your single top-starred repository to reach the threshold. Stars are not summed across multiple different repositories."
  },
  {
    id: "pair-extraordinaire",
    name: "Pair Extraordinaire",
    category: "earnable",
    availability: "Currently Earnable",
    description: "Co-authored commits on pull requests merged into a project's default branch.",
    officialRule: "Authored or co-authored commits in pull requests that get merged into the default branch.",
    confidence: "Official threshold",
    confidenceDetails: "Confirmed by GitHub official release notes and Git trailers documentation.",
    isOneTime: false,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "1 co-authored PR merged", badgeImg: "assets/badges/PairExtraordinaire.png" },
      { tier: 2, name: "Bronze", threshold: 10, label: "10 co-authored PRs merged", badgeImg: "assets/badges/PairExtraordinaire_Bronze.png" },
      { tier: 3, name: "Silver", threshold: 24, label: "24 co-authored PRs merged", badgeImg: "assets/badges/PairExtraordinaire_Silver.png" },
      { tier: 4, name: "Gold", threshold: 48, label: "48 co-authored PRs merged", badgeImg: "assets/badges/PairExtraordinaire_Gold.png" }
    ],
    metricName: "co-authored merged PRs",
    borderColor: "rgba(74, 222, 128, 0.45)",
    glowColor: "rgba(74, 222, 128, 0.2)",
    tip: "Use the standard git commit trailer: `Co-authored-by: Name <user@users.noreply.github.com>` on its own line after a blank line in commit messages."
  },
  {
    id: "galaxy-brain",
    name: "Galaxy Brain",
    category: "earnable",
    availability: "Currently Earnable",
    description: "Answered questions in GitHub Discussions that were chosen as the accepted answer.",
    officialRule: "Replies marked as accepted answers in GitHub Discussions under Q&A categories in repositories.",
    confidence: "Official threshold",
    confidenceDetails: "Official GitHub threshold. Note: GitHub Community Discussions stopped awarding this in Feb 2024; repository discussions still qualify.",
    isOneTime: false,
    tiers: [
      { tier: 1, name: "Default", threshold: 2, label: "2 accepted discussion answers", badgeImg: "assets/badges/GalaxyBrain.png" },
      { tier: 2, name: "Bronze", threshold: 8, label: "8 accepted discussion answers", badgeImg: "assets/badges/GalaxyBrain_Bronze.png" },
      { tier: 3, name: "Silver", threshold: 16, label: "16 accepted discussion answers", badgeImg: "assets/badges/GalaxyBrain_Silver.png" },
      { tier: 4, name: "Gold", threshold: 32, label: "32 accepted discussion answers", badgeImg: "assets/badges/GalaxyBrain_Gold.png" }
    ],
    metricName: "accepted discussion answers",
    borderColor: "rgba(56, 189, 248, 0.45)",
    glowColor: "rgba(56, 189, 248, 0.2)",
    tip: "Important: GitHub Community discussions ceased granting this achievement in February 2024. Only discussions in standard public repository Q&A sections now qualify."
  },
  {
    id: "finishing-touch",
    name: "Finishing Touch",
    category: "earnable",
    availability: "Currently Earnable",
    description: "Authored a merged pull request that improved user interface quality.",
    officialRule: "Authored and had merged a pull request dedicated to refining or fixing user interface components.",
    confidence: "Community-observed",
    confidenceDetails: "Tier thresholds are community-observed and documented across verified open-source tracking cohorts.",
    isOneTime: false,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "1 UI quality PR merged", badgeImg: "assets/badges/FinishingTouch.png" },
      { tier: 2, name: "Bronze", threshold: 4, label: "4 UI quality PRs merged", badgeImg: "assets/badges/FinishingTouch_Bronze.png" },
      { tier: 3, name: "Silver", threshold: 16, label: "16 UI quality PRs merged", badgeImg: "assets/badges/FinishingTouch_Silver.png" },
      { tier: 4, name: "Gold", threshold: 32, label: "32 UI quality PRs merged", badgeImg: "assets/badges/FinishingTouch_Gold.png" }
    ],
    metricName: "UI quality merged PRs",
    borderColor: "rgba(234, 179, 8, 0.45)",
    glowColor: "rgba(234, 179, 8, 0.2)",
    tip: "Thresholds are community-observed (1, 4, 16, 32). PRs addressing frontend accessibility, UI styling, and layout polish in qualifying repositories trigger this award."
  },
  {
    id: "quickdraw",
    name: "Quickdraw",
    category: "earnable",
    availability: "Currently Earnable",
    description: "Closed an issue or pull request within 5 minutes of opening.",
    officialRule: "Close an issue or pull request within 5 minutes of its creation timestamp.",
    confidence: "Official threshold",
    confidenceDetails: "Official single-tier achievement verified by GitHub.",
    isOneTime: true,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "Closed issue/PR < 5 mins", badgeImg: "assets/badges/Quickdraw.png" }
    ],
    metricName: "quick issue/PR closes",
    borderColor: "rgba(250, 204, 21, 0.45)",
    glowColor: "rgba(250, 204, 21, 0.2)",
    tip: "Single-tier milestone. Often unlocked naturally when closing an accidental duplicate issue or an immediate test PR within 5 minutes."
  },
  {
    id: "yolo",
    name: "YOLO",
    category: "earnable",
    availability: "Currently Earnable",
    description: "Merged a pull request without code review.",
    officialRule: "Directly merged a pull request without requesting or awaiting a peer code review.",
    confidence: "Official threshold",
    confidenceDetails: "Official single-tier achievement verified by GitHub.",
    isOneTime: true,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "Merged PR without review", badgeImg: "assets/badges/Yolo.png" }
    ],
    metricName: "PRs merged without review",
    borderColor: "rgba(244, 114, 182, 0.45)",
    glowColor: "rgba(244, 114, 182, 0.2)",
    tip: "Single-tier milestone. In personal repositories without branch protection, merge a pull request without a review step."
  },
  {
    id: "public-sponsor",
    name: "Public Sponsor",
    category: "earnable",
    availability: "Currently Earnable",
    description: "Sponsor open-source work via GitHub Sponsors.",
    officialRule: "Active public sponsorship tier through GitHub Sponsors of an open-source contributor or project.",
    confidence: "Official threshold",
    confidenceDetails: "Single-tier milestone verified by GitHub Sponsors.",
    isOneTime: true,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "Active public sponsorship", badgeImg: "assets/badges/PublicSponsor.png" }
    ],
    metricName: "sponsorships",
    borderColor: "rgba(244, 114, 182, 0.45)",
    glowColor: "rgba(244, 114, 182, 0.2)",
    tip: "Single-tier milestone. Requires your GitHub Sponsors payment or contribution to be marked Public on your profile."
  },

  // =========================================================================
  // B. Disabled / Historical Achievements (2 items)
  // =========================================================================
  {
    id: "heart-on-your-sleeve",
    name: "Heart On Your Sleeve",
    category: "disabled",
    availability: "Disabled / Not Currently Earnable",
    description: "Reacted with a heart emoji to an issue or pull request in a repository.",
    officialRule: "Experimental achievement awarded for emoji reactions during early test phases.",
    confidence: "Disabled / Unknown thresholds",
    confidenceDetails: "Experimental feature from early 2022 testing. Disabled by GitHub and cannot currently be earned.",
    isOneTime: false,
    tiers: [
      { tier: 1, name: "Default", threshold: null, label: "Historical tier", badgeImg: "assets/badges/HeartOnYourSleeve.png" },
      { tier: 2, name: "Bronze", threshold: null, label: "Bronze tier", badgeImg: "assets/badges/HeartOnYourSleeve_Bronze.png" },
      { tier: 3, name: "Silver", threshold: null, label: "Silver tier", badgeImg: "assets/badges/HeartOnYourSleeve_Silver.png" },
      { tier: 4, name: "Gold", threshold: null, label: "Gold tier", badgeImg: "assets/badges/HeartOnYourSleeve_Gold.png" }
    ],
    metricName: "heart reactions",
    borderColor: "rgba(244, 114, 182, 0.35)",
    glowColor: "rgba(244, 114, 182, 0.15)",
    tip: "Disabled by GitHub. Do not attempt to earn; preserved for historical records only."
  },
  {
    id: "open-sourcerer",
    name: "Open Sourcerer",
    category: "disabled",
    availability: "Disabled / Not Currently Earnable",
    description: "Made contributions across multiple open-source repositories.",
    officialRule: "Contributed accepted code across multiple external public repositories.",
    confidence: "Disabled / Unknown thresholds",
    confidenceDetails: "Experimental achievement tested internally and on select cohorts. Never officially released.",
    isOneTime: false,
    tiers: [
      { tier: 1, name: "Default", threshold: null, label: "Historical tier", badgeImg: "assets/badges/OpenSourcerer.png" },
      { tier: 2, name: "Bronze", threshold: null, label: "Bronze tier", badgeImg: "assets/badges/OpenSourcerer_Bronze.png" },
      { tier: 3, name: "Silver", threshold: null, label: "Silver tier", badgeImg: "assets/badges/OpenSourcerer_Silver.png" },
      { tier: 4, name: "Gold", threshold: null, label: "Gold tier", badgeImg: "assets/badges/OpenSourcerer_Gold.png" }
    ],
    metricName: "cross-repo contributions",
    borderColor: "rgba(56, 189, 248, 0.35)",
    glowColor: "rgba(56, 189, 248, 0.15)",
    tip: "Disabled by GitHub. Not active for new accounts."
  },

  // =========================================================================
  // C. Retired Achievements (2 items)
  // =========================================================================
  {
    id: "arctic-code-vault-contributor",
    name: "Arctic Code Vault Contributor",
    category: "retired",
    availability: "Retired / Event Ended",
    description: "Contributed code to a repository that was preserved in the GitHub Arctic Code Vault.",
    officialRule: "Authored a commit to any public repository included in the 02/02/2020 Arctic World Archive snapshot.",
    confidence: "Verified historical event",
    confidenceDetails: "Official historical event badge. Granted to contributors of repos archived in Svalbard on Feb 2, 2020.",
    isOneTime: true,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "Archived Repository Contributor", badgeImg: "assets/badges/Arctic-Code-Vault-Contributor.png" }
    ],
    metricName: "historical snapshot",
    borderColor: "rgba(56, 189, 248, 0.4)",
    glowColor: "rgba(56, 189, 248, 0.2)",
    tip: "Event concluded on February 2, 2020. This historical achievement cannot be unlocked anew."
  },
  {
    id: "mars-2020-contributor",
    name: "Mars 2020 Contributor",
    category: "retired",
    availability: "Retired / Event Ended",
    description: "Contributed to an open-source project used in NASA's Mars 2020 Ingenuity Helicopter mission.",
    officialRule: "Authored code merged into any repository listed in NASA JPL's Ingenuity open-source credits list.",
    confidence: "Verified historical event",
    confidenceDetails: "Official NASA JPL mission celebration badge. Concluded after Ingenuity mission operations completed.",
    isOneTime: true,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "Ingenuity Mission Contributor", badgeImg: "assets/badges/Mars-2020-Contributor.png" }
    ],
    metricName: "mission contributor",
    borderColor: "rgba(234, 88, 12, 0.4)",
    glowColor: "rgba(234, 88, 12, 0.2)",
    tip: "Event concluded. Preserved for accounts that contributed to eligible NASA Mars 2020 open-source repositories."
  },

  // =========================================================================
  // D. Internal Achievements (3 items)
  // =========================================================================
  {
    id: "proxima-pioneer",
    name: "Proxima Pioneer",
    category: "internal",
    availability: "Internal / GitHub Staff Only",
    description: "Participated in the M0 early testing phase of GitHub Next Proxima.",
    officialRule: "Internal GitHub employee participation in early Proxima testing milestone (M0).",
    confidence: "Verified",
    confidenceDetails: "Internal GitHub Staff achievement. Never available to public non-staff accounts.",
    isOneTime: true,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "M0 Milestone Pioneer", badgeImg: "assets/badges/ProximaPioneer.png" }
    ],
    metricName: "internal milestone",
    borderColor: "rgba(16, 185, 129, 0.4)",
    glowColor: "rgba(16, 185, 129, 0.15)",
    tip: "Internal achievement: Reserved exclusively for GitHub engineering staff. Excluded from public user completion totals."
  },
  {
    id: "proxima-staffshipper",
    name: "Proxima Staffshipper",
    category: "internal",
    availability: "Internal / GitHub Staff Only",
    description: "Participated in the M8 deployment shipping an internal Proxima Staffship instance.",
    officialRule: "Internal GitHub employee contribution to the deployment and shipping of Proxima (M8).",
    confidence: "Verified",
    confidenceDetails: "Internal GitHub Staff achievement. Never available to public non-staff accounts.",
    isOneTime: true,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "M8 Milestone Shipper", badgeImg: "assets/badges/ProximaStaffshipper.png" }
    ],
    metricName: "internal milestone",
    borderColor: "rgba(16, 185, 129, 0.4)",
    glowColor: "rgba(16, 185, 129, 0.15)",
    tip: "Internal achievement: Reserved exclusively for GitHub engineering staff. Excluded from public user completion totals."
  },
  {
    id: "proxima-staffuser",
    name: "Proxima Staffuser",
    category: "internal",
    availability: "Internal / GitHub Staff Only",
    description: "Awarded to internal GitHub teams actively onboarded to and utilizing the Proxima platform.",
    officialRule: "Belong to an internal GitHub team successfully migrated to Proxima workflows.",
    confidence: "Verified",
    confidenceDetails: "Internal GitHub Staff achievement. Never available to public non-staff accounts.",
    isOneTime: true,
    tiers: [
      { tier: 1, name: "Default", threshold: 1, label: "Team Onboarded to Proxima", badgeImg: "assets/badges/ProximaStaffuser.png" }
    ],
    metricName: "internal milestone",
    borderColor: "rgba(16, 185, 129, 0.4)",
    glowColor: "rgba(16, 185, 129, 0.15)",
    tip: "Internal achievement: Reserved exclusively for GitHub engineering staff. Excluded from public user completion totals."
  }
];

// =========================================================================
// E. Profile & Program Badges (Informational, Non-Collectible)
// =========================================================================
window.PROFILE_BADGES = [
  {
    id: "developer-program-member",
    name: "Developer Program Member",
    type: "Program Membership",
    icon: "⚡",
    badgeLabel: "Developer Program",
    description: "Awarded to registered developers building GitHub Apps, integrations, and tools using GitHub APIs.",
    howToEarn: "Register for free in the GitHub Developer Program at developer.github.com.",
    isCollectible: false
  },
  {
    id: "github-pro",
    name: "GitHub Pro",
    type: "Subscription Badge",
    icon: "💎",
    badgeLabel: "PRO",
    description: "Displays a badge next to the profile name indicating an active GitHub Pro subscription or GitHub Student Developer Pack.",
    howToEarn: "Subscribe to GitHub Pro or verify student status with the GitHub Student Developer Pack.",
    isCollectible: false
  },
  {
    id: "security-bug-bounty-hunter",
    name: "Security Bug Bounty Hunter",
    type: "Security Recognition",
    icon: "🛡️",
    badgeLabel: "Bug Bounty Hunter",
    description: "Honors ethical security researchers who reported valid vulnerabilities in GitHub's HackerOne Bug Bounty Program.",
    howToEarn: "Discover, report, and have a valid security vulnerability resolved through GitHub's Bug Bounty Program.",
    isCollectible: false
  },
  {
    id: "github-campus-expert",
    name: "GitHub Campus Expert",
    type: "Community Leadership",
    icon: "🎓",
    badgeLabel: "Campus Expert",
    description: "Designates student leaders trained by GitHub Education to organize hackathons, workshops, and build tech communities.",
    howToEarn: "Apply, undergo training, and be accepted into the GitHub Campus Experts Program.",
    isCollectible: false
  },
  {
    id: "security-advisory-credit",
    name: "Security Advisory Credit",
    type: "CVE / Advisory Credit",
    icon: "🔐",
    badgeLabel: "Security Credit",
    description: "Acknowledges contributors credited for discovering or remediating vulnerabilities in published GitHub Security Advisories.",
    howToEarn: "Be credited as a reporter or fixer in a published repository GitHub Security Advisory (GHSA).",
    isCollectible: false
  }
];

// =========================================================================
// F. Tier Progression Helper
// Computes exact tier status, progress to next tier, and remaining count.
// =========================================================================
window.calculateTierProgress = function(achievement, currentCount = 0, explicitlyEarnedTier = null, options = {}) {
  if (!achievement || !achievement.tiers || achievement.tiers.length === 0) {
    return {
      status: "locked",
      earnedTierLevel: 0,
      earnedTierName: "None",
      badgeImg: achievement ? (achievement.image || "assets/badges/PullShark.png") : "",
      nextTier: null,
      progressPercent: 0,
      currentCount: 0,
      nextThreshold: null,
      remainingCount: null,
      progressSummary: "Not started",
      corsRestricted: false
    };
  }

  // Handle CORS restricted / unavailable browser state
  if (options.corsRestricted && explicitlyEarnedTier === null && (currentCount === null || currentCount === undefined)) {
    return {
      status: "unavailable",
      earnedTierLevel: 0,
      earnedTierName: "None",
      highestTierObj: null,
      badgeImg: achievement.tiers[0].badgeImg,
      nextTier: achievement.tiers[0],
      progressPercent: 0,
      currentCount: null,
      nextThreshold: achievement.tiers[0].threshold,
      remainingCount: null,
      progressSummary: "Progress unavailable (CORS restricted on GitHub Pages)",
      isMaxTier: false,
      corsRestricted: true,
      profileTabUrl: options.profileTabUrl || null
    };
  }

  const tiers = achievement.tiers;
  let earnedTierLevel = 0;

  // If user has explicitly provided tier or we evaluate by count
  if (explicitlyEarnedTier !== null && explicitlyEarnedTier !== undefined) {
    if (typeof explicitlyEarnedTier === "number") {
      earnedTierLevel = explicitlyEarnedTier;
    } else {
      const idx = tiers.findIndex(t => t.name.toLowerCase() === String(explicitlyEarnedTier).toLowerCase());
      if (idx !== -1) earnedTierLevel = idx + 1;
    }
  } else if (currentCount > 0) {
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (tiers[i].threshold !== null && currentCount >= tiers[i].threshold) {
        earnedTierLevel = i + 1;
        break;
      }
    }
  }

  const highestTierObj = earnedTierLevel > 0 ? tiers[earnedTierLevel - 1] : null;
  const isMaxTier = earnedTierLevel === tiers.length;
  const nextTierObj = isMaxTier ? null : tiers[earnedTierLevel];

  // Guaranteed threshold from earned tier (never display a lower count than what tier proves)
  const verifiedMin = highestTierObj && highestTierObj.threshold !== null ? highestTierObj.threshold : 0;
  let effectiveCount = currentCount;
  let isVerifiedMinimum = false;

  if (earnedTierLevel > 0) {
    if (effectiveCount === null || effectiveCount === undefined || effectiveCount < verifiedMin) {
      effectiveCount = verifiedMin;
      isVerifiedMinimum = true;
    }
  } else if (effectiveCount === null || effectiveCount === undefined) {
    effectiveCount = 0;
  }

  let progressPercent = 0;
  let remainingCount = null;
  let progressSummary = "";

  if (isMaxTier) {
    progressPercent = 100;
    progressSummary = `Max tier reached (${highestTierObj.name} x${earnedTierLevel})!`;
  } else if (nextTierObj && nextTierObj.threshold !== null) {
    const targetThreshold = nextTierObj.threshold;
    
    // Percentage relative to target
    progressPercent = Math.min(100, Math.round((effectiveCount / targetThreshold) * 100));
    remainingCount = Math.max(0, targetThreshold - effectiveCount);

    const countLabelPrefix = isVerifiedMinimum ? "Verified Minimum: " : "";
    if (earnedTierLevel === 0) {
      if (effectiveCount > 0) {
        progressSummary = `${effectiveCount} / ${targetThreshold} ${achievement.metricName || 'units'} (${remainingCount} more to unlock x1 ${nextTierObj.name})`;
      } else {
        progressSummary = `Need ${targetThreshold} ${achievement.metricName || 'units'} to unlock x1 ${nextTierObj.name}`;
      }
    } else {
      progressSummary = `${countLabelPrefix}${effectiveCount} / ${targetThreshold} ${achievement.metricName || 'units'} — ${remainingCount} more to reach x${nextTierObj.tier || (earnedTierLevel + 1)} ${nextTierObj.name}`;
    }
  } else {
    progressSummary = earnedTierLevel > 0 ? `Earned (${highestTierObj.name})` : "Locked";
  }

  // Choose appropriate badge image
  const displayBadgeImg = highestTierObj ? highestTierObj.badgeImg : tiers[0].badgeImg;

  // Status string
  let status = "locked";
  if (earnedTierLevel > 0) {
    status = "earned";
  } else if (effectiveCount > 0) {
    status = "in-progress";
  }

  return {
    status,
    earnedTierLevel,
    earnedTierName: highestTierObj ? highestTierObj.name : "None",
    highestTierObj,
    badgeImg: displayBadgeImg,
    nextTier: nextTierObj,
    progressPercent,
    currentCount: effectiveCount,
    isVerifiedMinimum,
    nextThreshold: nextTierObj ? nextTierObj.threshold : null,
    remainingCount,
    progressSummary,
    isMaxTier,
    corsRestricted: !!options.corsRestricted,
    profileTabUrl: options.profileTabUrl || null,
    confidence: isVerifiedMinimum ? "VERIFIED_MINIMUM" : (earnedTierLevel > 0 ? "VERIFIED" : (effectiveCount > 0 ? "ESTIMATED" : "UNAVAILABLE"))
  };
};

// =========================================================================
// G. Predefined Test & Example Profiles (Kept for automated test runner)
// =========================================================================
window.SAMPLE_PROFILES = {
  "ayushcmd": {
    username: "ayushcmd",
    name: "Ayush",
    title: "GitHub Developer",
    avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23050807'/%3E%3Cpath fill='%23ffffff' d='M24 10c-7.73 0-14 6.27-14 14 0 6.19 4.01 11.44 9.57 13.29.7.13.96-.3.96-.67 0-.33-.01-1.21-.02-2.38-3.89.85-4.71-1.88-4.71-1.88-.64-1.62-1.55-2.05-1.55-2.05-1.27-.87.1-.85.1-.85 1.4.1 2.14 1.44 2.14 1.44 1.25 2.14 3.28 1.52 4.08 1.16.13-.91.49-1.52.89-1.87-3.11-.35-6.38-1.55-6.38-6.91 0-1.53.55-2.77 1.44-3.75-.14-.35-.63-1.78.14-3.7 0 0 1.18-.38 3.85 1.43a13.4 13.4 0 0 1 7 0c2.67-1.81 3.84-1.43 3.84-1.43.77 1.92.28 3.35.14 3.7.9.98 1.44 2.22 1.44 3.75 0 5.38-3.28 6.55-6.4 6.9.5.43.95 1.28.95 2.58 0 1.86-.02 3.36-.02 3.82 0 .38.25.81.97.67A14.02 14.02 0 0 0 38 24c0-7.73-6.27-14-14-14z'/%3E%3C/svg%3E",
    profileUrl: "https://github.com/ayushcmd",
    repositories: 42,
    followers: 127,
    following: 31,
    isExample: true,
    note: "Default reference mockup profile",
    achievements: {
      "pull-shark": { tier: 2, count: 16 },
      "starstruck": { tier: 1, count: 18 },
      "pair-extraordinaire": { tier: 1, count: 1 },
      "quickdraw": { tier: 1, count: 1 },
      "yolo": { tier: 1, count: 1 },
      "public-sponsor": { tier: 1, count: 1 },
      "finishing-touch": { tier: 1, count: 1 }
    }
  },
  "pull-shark-x2": {
    username: "coder_bronze",
    name: "Alex Rivera",
    title: "Open Source Contributor",
    avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23cd7f32'/%3E%3Ctext x='50%25' y='55%25' fill='%23ffffff' font-size='20' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3EAR%3C/text%3E%3C/svg%3E",
    profileUrl: "https://github.com",
    repositories: 28,
    followers: 84,
    following: 19,
    isExample: true,
    note: "Testing Pull Shark x2 (Bronze) tier with 16 merged PRs",
    achievements: {
      "pull-shark": { tier: 2, count: 16 }
    }
  },
  "pull-shark-x3": {
    username: "coder_silver",
    name: "Sarah Chen",
    title: "Senior Full-Stack Engineer",
    avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%2394a3b8'/%3E%3Ctext x='50%25' y='55%25' fill='%23ffffff' font-size='20' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3ESC%3C/text%3E%3C/svg%3E",
    profileUrl: "https://github.com",
    repositories: 64,
    followers: 320,
    following: 45,
    isExample: true,
    note: "Testing Pull Shark x3 (Silver) tier with 128 merged PRs",
    achievements: {
      "pull-shark": { tier: 3, count: 128 }
    }
  },
  "pull-shark-x4": {
    username: "coder_gold",
    name: "David Kim",
    title: "Principal Core Maintainer",
    avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23eab308'/%3E%3Ctext x='50%25' y='55%25' fill='%23ffffff' font-size='20' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3EDK%3C/text%3E%3C/svg%3E",
    profileUrl: "https://github.com",
    repositories: 142,
    followers: 1250,
    following: 60,
    isExample: true,
    note: "Testing Pull Shark x4 (Gold) maximum tier with 1,024 merged PRs",
    achievements: {
      "pull-shark": { tier: 4, count: 1024 }
    }
  },
  "single-tier-only": {
    username: "single_achiever",
    name: "Elena Rostova",
    title: "Fast Responder",
    avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%2310b981'/%3E%3Ctext x='50%25' y='55%25' fill='%23ffffff' font-size='20' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3EER%3C/text%3E%3C/svg%3E",
    profileUrl: "https://github.com",
    repositories: 15,
    followers: 42,
    following: 12,
    isExample: true,
    note: "Testing single-tier achievements (Quickdraw and YOLO earned)",
    achievements: {
      "quickdraw": { tier: 1, count: 1 },
      "yolo": { tier: 1, count: 1 }
    }
  },
  "retired-collector": {
    username: "veteran_dev",
    name: "Jordan Vance",
    title: "Historical Contributor",
    avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%2338bdf8'/%3E%3Ctext x='50%25' y='55%25' fill='%23ffffff' font-size='20' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3EJV%3C/text%3E%3C/svg%3E",
    profileUrl: "https://github.com",
    repositories: 88,
    followers: 410,
    following: 80,
    isExample: true,
    note: "Testing retired historical badges (Arctic Code Vault and Mars 2020)",
    achievements: {
      "arctic-code-vault-contributor": { tier: 1, count: 1 },
      "mars-2020-contributor": { tier: 1, count: 1 },
      "pull-shark": { tier: 2, count: 24 },
      "starstruck": { tier: 2, count: 180 }
    }
  },
  "zero-achievements": {
    username: "fresh_coder",
    name: "New Contributor",
    title: "Student & Aspiring Builder",
    avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%231e293b'/%3E%3Ctext x='50%25' y='55%25' fill='%2394a3b8' font-size='20' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3E🌱%3C/text%3E%3C/svg%3E",
    profileUrl: "https://github.com",
    repositories: 2,
    followers: 1,
    following: 5,
    isExample: true,
    note: "Brand new account with zero earned achievements",
    achievements: {}
  },
  "hidden-achievements": {
    username: "private_builder",
    name: "Stealth Contributor",
    title: "Security & Enterprise Engineer",
    avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23090d16'/%3E%3Ctext x='50%25' y='55%25' fill='%2364748b' font-size='20' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3E🕶️%3C/text%3E%3C/svg%3E",
    profileUrl: "https://github.com",
    repositories: 35,
    followers: 95,
    following: 20,
    isExample: true,
    isHiddenAchievements: true,
    note: "Profile owner has disabled public display of achievements in profile settings",
    achievements: {}
  }
};

// Helper to evaluate a full profile against the entire catalogue
window.buildProfileState = function(profileRaw) {
  const profile = JSON.parse(JSON.stringify(profileRaw));
  const rawAchievements = profile.achievements || {};

  const evaluatedList = window.ACHIEVEMENT_CATALOGUE.map(item => {
    const userRecord = rawAchievements[item.id] || {};
    const userCount = userRecord ? userRecord.count : null;
    const userTier = userRecord ? userRecord.tier : null;

    const progressInfo = window.calculateTierProgress(item, userCount, userTier, {
      corsRestricted: userRecord.corsRestricted,
      profileTabUrl: userRecord.profileTabUrl
    });

    return {
      ...item,
      userCount,
      userTier,
      progress: progressInfo,
      detectionMeta: userRecord
    };
  });

  // Calculate statistics according to strict rules:
  // - Public earnable denominator = exactly 8 currently earnable achievements
  const earnableItems = evaluatedList.filter(i => i.category === "earnable");
  const earnedEarnableCount = earnableItems.filter(i => i.progress.status === "earned").length;
  const inProgressCount = earnableItems.filter(i => i.progress.status === "in-progress" || (i.progress.status === "earned" && !i.progress.isMaxTier)).length;

  // Bonus retired badges earned
  const retiredEarned = evaluatedList.filter(i => i.category === "retired" && i.progress.status === "earned").length;

  // Total earned (earnable + retired, excluding internal/disabled)
  const totalEarnedCount = earnedEarnableCount + retiredEarned;
  const completionPercent = Math.min(100, Math.round((earnedEarnableCount / earnableItems.length) * 100));

  // Determine Next Up recommendation:
  // Find highest priority in-progress earnable badge or first earnable badge
  let nextUpItem = earnableItems.find(i => i.progress.status === "in-progress");
  if (!nextUpItem) {
    nextUpItem = earnableItems.find(i => i.progress.status === "earned" && !i.progress.isMaxTier);
  }
  if (!nextUpItem) {
    nextUpItem = earnableItems.find(i => i.progress.status === "locked");
  }
  if (!nextUpItem) {
    nextUpItem = earnableItems[0];
  }

  return {
    ...profile,
    catalogue: evaluatedList,
    totalEarnableCount: earnableItems.length,
    earnedCount: totalEarnedCount,
    earnedEarnableCount,
    remainingCount: Math.max(0, earnableItems.length - earnedEarnableCount),
    inProgressCount,
    completionPercent,
    nextUp: nextUpItem
  };
};
