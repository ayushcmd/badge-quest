/**
 * Badge Quest — Production Dashboard UI Application
 * 
 * Features:
 * - Real-time unauthenticated GitHub REST API integration
 * - Zero hardcoded profiles in production; clean initial search experience
 * - 15-achievement catalogue coverage (Earnable, Retired, Disabled, Internal)
 * - Multi-tier calculation engine (x1, x2 Bronze, x3 Silver, x4 Gold)
 * - Honest browser CORS disclosure with direct GitHub profile achievement links
 * - API quota indicator, session caching, and Refresh functionality
 * - Pure client-side static execution for GitHub Pages root deployment
 */

(function () {
  "use strict";

  // State
  let currentProfile = null;
  let currentFilter = "all";
  let activeSearchQuery = "";

  // DOM Elements - Search & Header
  const searchForm = document.getElementById("searchForm");
  const usernameInput = document.getElementById("usernameInput");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const refreshBtn = document.getElementById("refreshBtn");
  const rateLimitDisplay = document.getElementById("rateLimitDisplay");
  const rateDot = document.getElementById("rateDot");

  // Dashboard Middle Section Containers
  const welcomeCard = document.getElementById("welcomeCard");
  const errorBanner = document.getElementById("errorBanner");
  const errorTitle = document.getElementById("errorTitle");
  const errorMessage = document.getElementById("errorMessage");
  const profileCard = document.getElementById("profileCard");
  const overviewCard = document.getElementById("overviewCard");
  const nextUpCard = document.getElementById("nextUpCard");

  // Profile Card DOM Elements
  const profileAvatar = document.getElementById("profileAvatar");
  const profileUsername = document.getElementById("profileUsername");
  const profileTag = document.getElementById("profileTag");
  const profileDesc = document.getElementById("profileDesc");
  const statRepos = document.getElementById("statRepos");
  const statFollowers = document.getElementById("statFollowers");
  const statFollowing = document.getElementById("statFollowing");
  const btnViewProfile = document.getElementById("btnViewProfile");
  const profileMetaLine = document.getElementById("profileMetaLine");
  const profileLastUpdated = document.getElementById("profileLastUpdated");
  const profileCacheNotice = document.getElementById("profileCacheNotice");

  // Overview Card DOM Elements
  const overviewRatio = document.getElementById("overviewRatio");
  const overviewProgressFill = document.getElementById("overviewProgressFill");
  const overviewProgressPct = document.getElementById("overviewProgressPct");
  const metricEarned = document.getElementById("metricEarned");
  const metricRemaining = document.getElementById("metricRemaining");
  const metricCollection = document.getElementById("metricCollection");

  // Next Up Card DOM Elements
  const nextUpBadgeImg = document.getElementById("nextUpBadgeImg");
  const nextUpTitle = document.getElementById("nextUpTitle");
  const nextUpDesc = document.getElementById("nextUpDesc");
  const nextUpProgressFill = document.getElementById("nextUpProgressFill");
  const nextUpProgressMetaLeft = document.getElementById("nextUpProgressMetaLeft");
  const nextUpProgressMetaRight = document.getElementById("nextUpProgressMetaRight");
  const btnNextUpDetails = document.getElementById("btnNextUpDetails");

  // Achievements Grid & Filter DOM Elements
  const achievementsGrid = document.getElementById("achievementsGrid");
  const filterBtns = document.querySelectorAll("[data-filter]");
  const countAll = document.getElementById("countAll");
  const countEarnable = document.getElementById("countEarnable");
  const countEarned = document.getElementById("countEarned");
  const countInProgress = document.getElementById("countInProgress");
  const countRetired = document.getElementById("countRetired");
  const countDisabled = document.getElementById("countDisabled");
  const countInternal = document.getElementById("countInternal");

  // Profile Badges Section DOM
  const profileBadgesGrid = document.getElementById("profileBadgesGrid");

  // Modal Elements
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalBadgeCard = document.getElementById("modalBadgeCard");

  // Generic Dialog Modal (About / Leaderboard)
  const genericModalBackdrop = document.getElementById("genericModalBackdrop");
  const genericModalCloseBtn = document.getElementById("genericModalCloseBtn");
  const genericModalTitle = document.getElementById("genericModalTitle");
  const genericModalBody = document.getElementById("genericModalBody");

  // Toast
  const toastNotice = document.getElementById("toastNotice");

  function showToast(message, duration = 3500) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add("is-visible");
    setTimeout(() => {
      toastNotice.classList.remove("is-visible");
    }, duration);
  }

  function showError(title, msg) {
    if (errorBanner) {
      errorTitle.textContent = title;
      errorMessage.textContent = msg;
      errorBanner.style.display = "flex";
      errorBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function hideError() {
    if (errorBanner) {
      errorBanner.style.display = "none";
    }
  }

  /**
   * Update Rate Limit display from live API headers.
   */
  function handleRateLimitUpdate(e) {
    const data = e.detail;
    if (!data || !rateLimitDisplay) return;
    rateLimitDisplay.textContent = `API Quota: ${data.remaining}/${data.limit}`;
    
    if (rateDot) {
      rateDot.classList.remove("is-warning", "is-exhausted");
      if (data.remaining === 0) {
        rateDot.classList.add("is-exhausted");
      } else if (data.remaining <= 10) {
        rateDot.classList.add("is-warning");
      }
    }
  }

  /**
   * Render an analyzed GitHub profile into the dashboard cards and grid.
   */
  function renderProfile(profile) {
    if (!profile) return;
    if (!profile.catalogue) {
      profile = window.buildProfileState(profile);
    }
    currentProfile = profile;
    activeSearchQuery = profile.username;

    // Show dashboard cards, hide welcome state
    if (welcomeCard) welcomeCard.style.display = "none";
    if (profileCard) profileCard.style.display = "flex";
    if (overviewCard) overviewCard.style.display = "flex";
    if (nextUpCard) nextUpCard.style.display = "flex";
    if (refreshBtn) refreshBtn.style.display = "inline-flex";
    hideError();

    // 1. Profile Card
    profileAvatar.src = profile.avatarUrl || "assets/badges/GalaxyBrain.png";
    profileUsername.textContent = profile.username;
    profileUsername.href = profile.profileUrl || `https://github.com/${profile.username}`;

    if (profile.isExample) {
      profileTag.style.display = "inline-block";
      profileTag.textContent = profile.note || "Sample Profile";
    } else {
      profileTag.style.display = "inline-block";
      profileTag.textContent = "Live Profile";
    }

    profileDesc.textContent = profile.title || "GitHub Developer";
    statRepos.textContent = (profile.repositories || 0).toLocaleString();
    statFollowers.textContent = (profile.followers || 0).toLocaleString();
    statFollowing.textContent = (profile.following || 0).toLocaleString();
    btnViewProfile.href = profile.profileUrl || `https://github.com/${profile.username}`;

    if (profileMetaLine) {
      profileMetaLine.style.display = "flex";
      if (profileLastUpdated) {
        profileLastUpdated.textContent = `Last analyzed: ${profile.lastUpdated || "Just now"}`;
      }
      if (profileCacheNotice) {
        profileCacheNotice.textContent = profile.isFromCache ? "Cached (Instant)" : "Live GitHub Data";
      }
    }

    // 2. Overview Card
    overviewRatio.textContent = `${profile.earnedEarnableCount} / ${profile.totalEarnableCount} Earned`;
    overviewProgressFill.style.width = `${profile.completionPercent}%`;
    overviewProgressPct.textContent = `${profile.completionPercent}%`;
    metricEarned.textContent = profile.earnedCount;
    metricRemaining.textContent = profile.remainingCount;
    metricCollection.textContent = `${profile.completionPercent}%`;

    // 3. Next Up Card
    const nu = profile.nextUp;
    if (nu && nu.progress) {
      nextUpBadgeImg.src = nu.progress.badgeImg;
      if (nu.progress.nextTier) {
        nextUpTitle.textContent = `${nu.name} x${nu.progress.nextTier.tier} (${nu.progress.nextTier.name})`;
        nextUpDesc.textContent = nu.progress.progressSummary || nu.description;
        nextUpProgressFill.style.width = `${nu.progress.progressPercent}%`;
        const metaLeft = nu.progress.currentCount !== null
          ? `${nu.progress.currentCount} / ${nu.progress.nextThreshold} (${nu.progress.nextTier.name})`
          : `Target: ${nu.progress.nextThreshold} ${nu.metricName || 'units'}`;
        nextUpProgressMetaLeft.textContent = metaLeft;
        nextUpProgressMetaRight.textContent = `${nu.progress.progressPercent}%`;
      } else {
        nextUpTitle.textContent = nu.name;
        nextUpDesc.textContent = `Completed ${nu.progress.earnedTierName} tier!`;
        nextUpProgressFill.style.width = `100%`;
        nextUpProgressMetaLeft.textContent = `${nu.progress.earnedTierName} (Max Tier)`;
        nextUpProgressMetaRight.textContent = `100%`;
      }
    }

    // 4. Filter Counts
    const cat = profile.catalogue;
    const earnableTotal = cat.filter(a => a.category === "earnable").length;
    const earnedTotal = cat.filter(a => a.progress.status === "earned").length;
    const inProgTotal = cat.filter(a => a.progress.status === "in-progress" || (a.category === "earnable" && a.progress.status === "earned" && !a.progress.isMaxTier)).length;
    const retiredTotal = cat.filter(a => a.category === "retired").length;
    const disabledTotal = cat.filter(a => a.category === "disabled").length;
    const internalTotal = cat.filter(a => a.category === "internal").length;

    if (countAll) countAll.textContent = `All (${cat.length})`;
    if (countEarnable) countEarnable.textContent = `⚡ Earnable (${earnableTotal})`;
    if (countEarned) countEarned.textContent = `✔ Earned (${earnedTotal})`;
    if (countInProgress) countInProgress.textContent = `⏱ In Progress (${inProgTotal})`;
    if (countRetired) countRetired.textContent = `📦 Retired (${retiredTotal})`;
    if (countDisabled) countDisabled.textContent = `⛔ Disabled (${disabledTotal})`;
    if (countInternal) countInternal.textContent = `🏢 Internal (${internalTotal})`;

    // 5. Render Grid & Profile Badges
    renderAchievementsGrid();
    renderProfileBadges();
  }

  /**
   * Render catalogue when no profile is loaded yet (initial empty state catalogue preview).
   */
  function renderInitialCatalogue() {
    if (!window.ACHIEVEMENT_CATALOGUE || !achievementsGrid) return;
    
    // Create unauthenticated initial preview state
    const previewList = window.ACHIEVEMENT_CATALOGUE.map(item => ({
      ...item,
      userCount: 0,
      userTier: null,
      progress: {
        status: "locked",
        earnedTierLevel: 0,
        earnedTierName: "None",
        badgeImg: item.tiers[0].badgeImg,
        nextTier: item.tiers[0],
        progressPercent: 0,
        currentCount: 0,
        nextThreshold: item.tiers[0].threshold,
        remainingCount: item.tiers[0].threshold,
        progressSummary: `Threshold: ${item.tiers[0].label || 'Milestone'}`
      }
    }));

    currentProfile = {
      username: "",
      catalogue: previewList,
      totalEarnableCount: 8,
      earnedCount: 0,
      earnedEarnableCount: 0,
      remainingCount: 8,
      completionPercent: 0
    };

    renderAchievementsGrid();
    renderProfileBadges();
  }

  /**
   * Render the 15-item achievement grid based on current filter.
   */
  function renderAchievementsGrid() {
    if (!currentProfile || !achievementsGrid) return;

    let items = currentProfile.catalogue || [];

    if (currentFilter === "earnable") {
      items = items.filter(a => a.category === "earnable");
    } else if (currentFilter === "earned") {
      items = items.filter(a => a.progress.status === "earned");
    } else if (currentFilter === "in-progress") {
      items = items.filter(a => a.progress.status === "in-progress" || (a.category === "earnable" && a.progress.status === "earned" && !a.progress.isMaxTier));
    } else if (currentFilter === "retired") {
      items = items.filter(a => a.category === "retired");
    } else if (currentFilter === "disabled") {
      items = items.filter(a => a.category === "disabled");
    } else if (currentFilter === "internal") {
      items = items.filter(a => a.category === "internal");
    }

    if (items.length === 0) {
      achievementsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: #94a3b8;">
          <p style="font-size: 1.1rem; font-weight: 700; color: #cbd5e1;">No achievements in this filter</p>
          <p style="font-size: 0.85rem; margin-top: 6px;">Try selecting "All" or "Earnable" to view badge milestones.</p>
        </div>
      `;
      return;
    }

    achievementsGrid.innerHTML = items.map(item => {
      const p = item.progress;

      // Status pill determination
      let statusClass = "is-locked";
      let statusIcon = "🔒";
      let statusText = "Locked";

      if (p.status === "earned") {
        if (!item.isOneTime && p.earnedTierLevel > 0) {
          if (p.earnedTierLevel === 4) {
            statusClass = "is-tier-gold";
            statusIcon = "🥇";
            statusText = `x4 Gold`;
          } else if (p.earnedTierLevel === 3) {
            statusClass = "is-tier-silver";
            statusIcon = "🥈";
            statusText = `x3 Silver`;
          } else if (p.earnedTierLevel === 2) {
            statusClass = "is-tier-bronze";
            statusIcon = "🥉";
            statusText = `x2 Bronze`;
          } else {
            statusClass = "is-tier-default";
            statusIcon = "✔";
            statusText = `x1 Default`;
          }
        } else {
          statusClass = "is-earned";
          statusIcon = "✔";
          statusText = "Earned";
        }
      } else if (p.status === "in-progress") {
        statusClass = "is-in-progress";
        statusIcon = "⏱";
        statusText = "In Progress";
      } else if (p.status === "unavailable" || p.corsRestricted) {
        statusClass = "is-locked";
        statusIcon = "🌐";
        statusText = "Check on GitHub";
      } else if (item.category === "retired") {
        statusClass = "is-retired";
        statusIcon = "📦";
        statusText = "Event Ended";
      } else if (item.category === "disabled") {
        statusClass = "is-disabled";
        statusIcon = "⛔";
        statusText = "Disabled";
      } else if (item.category === "internal") {
        statusClass = "is-internal";
        statusIcon = "🏢";
        statusText = "Staff Only";
      }

      // Micro progress or activity counter on card
      let microProgressHTML = "";
      const isMax = p.isMaxTier;

      if (isMax) {
        microProgressHTML = `
          <div class="card-micro-progress" title="Max Tier Complete">
            <div class="micro-progress-bar">
              <div class="micro-progress-fill" style="width: 100%; background: #facc15;"></div>
            </div>
            <div class="micro-progress-text" style="color: #facc15;">
              ${p.currentCount !== null ? `${p.currentCount.toLocaleString()} ${item.metricName || 'units'} · ` : ''}Max Tier Complete
            </div>
          </div>
        `;
      } else if (p.currentCount !== null && p.currentCount !== undefined && p.nextThreshold !== null) {
        const countPrefix = p.isVerifiedMinimum ? "≥ " : "";
        const labelText = `${countPrefix}${p.currentCount.toLocaleString()} / ${p.nextThreshold.toLocaleString()} ${item.metricName || 'units'}`;
        const remainingText = p.remainingCount !== null && p.remainingCount > 0
          ? `${p.remainingCount.toLocaleString()} left to ${p.nextTier ? p.nextTier.name : 'Next'}`
          : "Target reached";

        microProgressHTML = `
          <div class="card-micro-progress" title="${labelText} (${remainingText})">
            <div class="micro-progress-bar">
              <div class="micro-progress-fill" style="width: ${p.progressPercent}%;"></div>
            </div>
            <div class="micro-progress-text">
              ${labelText} (${remainingText})
            </div>
          </div>
        `;
      } else if (item.category === "earnable" && (p.status === "earned" || p.status === "in-progress")) {
        microProgressHTML = `
          <div class="card-micro-progress">
            <div class="micro-progress-text" style="color: #94a3b8; font-style: italic;">
              Live count unavailable — achievement tier verified.
            </div>
          </div>
        `;
      } else if (item.category === "earnable" && p.nextThreshold !== null) {
        microProgressHTML = `
          <div class="card-micro-progress">
            <div class="micro-progress-text" style="color: #64748b;">
              Milestone: ${p.nextThreshold} ${item.metricName || 'units'}
            </div>
          </div>
        `;
      } else if (p.corsRestricted && currentProfile.username) {
        microProgressHTML = `
          <div class="card-micro-progress" style="text-align: center;">
            <a class="badge-cors-notice" href="https://github.com/${encodeURIComponent(currentProfile.username)}?tab=achievements" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">
              Inspect on GitHub ↗
            </a>
          </div>
        `;
      }

      return `
        <article class="achievement-card" data-badge-id="${item.id}" style="border-color: ${item.borderColor}; box-shadow: 0 10px 24px -4px ${item.glowColor};" tabindex="0" role="button" aria-label="View details for ${item.name}">
          <div class="badge-pedestal">
            <img src="${p.badgeImg}" alt="${item.name} badge icon" loading="lazy">
          </div>
          
          <div class="card-badge-info">
            <span class="card-badge-category">${item.availability}</span>
            <h3 class="card-badge-name">${item.name}</h3>
          </div>

          <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
            <span class="status-pill ${statusClass}">
              <span>${statusIcon}</span>
              <span>${statusText}</span>
            </span>
            ${microProgressHTML}
          </div>
        </article>
      `;
    }).join("");
  }

  /**
   * Render Informational Profile Badges.
   */
  function renderProfileBadges() {
    if (!profileBadgesGrid || !window.PROFILE_BADGES) return;

    profileBadgesGrid.innerHTML = window.PROFILE_BADGES.map(b => `
      <div class="program-badge-card">
        <div class="program-card-header">
          <span class="program-badge-icon">${b.icon}</span>
          <span class="program-badge-pill">${b.badgeLabel}</span>
        </div>
        <h4 class="program-badge-title">${b.name}</h4>
        <p class="program-badge-desc">${b.description}</p>
        <div class="program-badge-rule">
          <strong>How to obtain:</strong> ${b.howToEarn}
        </div>
      </div>
    `).join("");
  }

  /**
   * Search Handler: Queries GitHub API for the entered username.
   */
  async function handleSearch(e, forceRefresh = false) {
    if (e && e.preventDefault) e.preventDefault();

    const query = usernameInput.value.trim();
    const val = window.GitHubAPI.validateUsername(query);
    if (!val.valid) {
      showError("Invalid Username", val.error);
      showToast(val.error);
      return;
    }

    hideError();
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `<span class="loading-spinner"></span> Analyzing...`;
    if (refreshBtn) refreshBtn.disabled = true;

    try {
      const profile = await window.GitHubAPI.fetchProfile(val.cleanUser, forceRefresh);
      renderProfile(profile);
      showToast(`Loaded @${profile.username} (${profile.repositories} repos)!`);
      
      // Auto-scroll on mobile viewports for smooth UX
      if (window.innerWidth < 768) {
        document.getElementById("dashboardRow").scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("[BadgeQuest] Search error:", err);
      showError("Could Not Analyze GitHub User", err.message || "An unexpected error occurred.");
      showToast(err.message || "Could not fetch user.");
      
      // Keep welcome card visible if no valid profile exists
      if (!currentProfile || !currentProfile.username) {
        if (welcomeCard) welcomeCard.style.display = "flex";
        if (profileCard) profileCard.style.display = "none";
        if (overviewCard) overviewCard.style.display = "none";
        if (nextUpCard) nextUpCard.style.display = "none";
      }
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        Analyze
      `;
      if (refreshBtn) refreshBtn.disabled = false;
    }
  }

  /**
   * Achievement Guidance Checklist
   */
  const ACHIEVEMENT_TIPS = {
    "pull-shark": [
      "Focus on genuine, meaningful contributions.",
      "Get your PRs reviewed and merged.",
      "Contribute to open-source and collaborative projects."
    ],
    "starstruck": [
      "Build useful repositories and developer tools.",
      "Share projects with relevant developer communities.",
      "Track the highest-starred eligible repository."
    ],
    "pair-extraordinaire": [
      "Collaborate with other contributors on shared repositories.",
      "Add Co-authored-by Git trailers to commits.",
      "Make qualifying co-authored merged PRs."
    ],
    "galaxy-brain": [
      "Participate in qualifying GitHub Discussions.",
      "Provide clear, well-explained and useful solutions.",
      "Get your replies marked as accepted answers."
    ],
    "finishing-touch": [
      "Focus on frontend UI, styling, and UX refinements.",
      "Improve design components and accessibility.",
      "Qualifies via merged UI-dedicated pull requests."
    ],
    "quickdraw": [
      "Close an issue or PR within 5 minutes of opening.",
      "Applies to repository issues and pull requests.",
      "Often unlocked during rapid issue triage or testing."
    ],
    "yolo": [
      "Merge a qualifying PR without a peer code review.",
      "Works on personal repos without branch protection.",
      "Requires genuine pull request creation and merge."
    ],
    "public-sponsor": [
      "Sponsor open-source work via GitHub Sponsors.",
      "Ensure sponsorship visibility is set to Public.",
      "Applies to active community open-source sponsorships."
    ],
    "heart-on-your-sleeve": [
      "Experimental badge tested in early 2022.",
      "Disabled by GitHub; cannot currently be earned.",
      "Preserved for historical reference and catalogue completion."
    ],
    "open-sourcerer": [
      "Experimental multi-repository contribution badge.",
      "Never officially released to public accounts.",
      "Preserved for historical reference and catalogue records."
    ],
    "arctic-code-vault-contributor": [
      "Archived on Feb 2, 2020 in the Svalbard Arctic World Archive.",
      "Historical snapshot event concluded.",
      "Awarded to contributors of archived public repositories."
    ],
    "mars-2020-contributor": [
      "Celebrates NASA's Mars 2020 Ingenuity Helicopter mission.",
      "Awarded to contributors of mission-critical dependencies.",
      "Historical milestone permanently completed."
    ],
    "proxima-pioneer": [
      "Internal GitHub employee testing milestone (M0).",
      "Restricted exclusively to GitHub engineering staff.",
      "Excluded from public user completion totals."
    ],
    "proxima-staffshipper": [
      "Internal GitHub deployment milestone (M8).",
      "Restricted exclusively to GitHub engineering staff.",
      "Excluded from public user completion totals."
    ],
    "proxima-staffuser": [
      "Internal GitHub employee team platform adoption.",
      "Restricted exclusively to GitHub engineering staff.",
      "Excluded from public user completion totals."
    ]
  };

  const MODAL_ICONS = {
    barChart: `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#00e676" stroke-width="2" stroke-linecap="round"><path d="M4 16v-4m6 4V4m6 12v-8"/></svg>`,
    layers: `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#00e676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7l8-4 8 4-8 4-8-4zm0 6l8 4 8-4M2 9l8 4 8-4"/></svg>`,
    clock: `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#00e676" stroke-width="2" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2"/></svg>`,
    book: `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#00e676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H18V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18"/></svg>`,
    target: `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#00e676" stroke-width="2" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3"/><path d="M10 2v2m0 12v2M2 10h2m12 0h2"/></svg>`,
    bulb: `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h2m-3-3h4M10 2a6 6 0 0 0-6 6c0 2.22 1.21 4.16 3 5.2V15h6v-1.8c1.79-1.04 3-2.98 3-5.2a6 6 0 0 0-6-6z"/></svg>`,
    prMerge: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M5 3.254V3.25a.75.75 0 1 1 1.5 0v.004a2.501 2.501 0 0 1 1.77 1.77h3.48a.75.75 0 0 1 0 1.5H8.27A2.501 2.501 0 0 1 5.75 8.25v2.504a2.501 2.501 0 1 1-1.5 0V5.754a2.5 2.5 0 0 1 .75-4.496V1.25a.75.75 0 0 1 1.5 0v2.004zm0 2.496a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>`,
    github: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
    refresh: `<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 8a5.5 5.5 0 0 1 9.35-3.92L14 6m-.5-4v4h-4M13.5 8a5.5 5.5 0 0 1-9.35 3.92L2 10m.5 4v-4h4"/></svg>`,
    external: `<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path fill-rule="evenodd" d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V3.707L4.354 10.354a.5.5 0 1 1-.708-.708L10.293 3H4.5a.5.5 0 0 1-.5-.5z"/></svg>`
  };

  function formatMilestoneDate(dateStr) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
    } catch (e) {}
    return String(dateStr);
  }

  function getHeaderStatusPill(item, p) {
    if (item.category === "earnable") {
      if (p.earnedTierLevel > 0) {
        if (item.tiers && item.tiers.length > 1) {
          const tierName = p.earnedTierName || (item.tiers[p.earnedTierLevel - 1] ? item.tiers[p.earnedTierLevel - 1].name : "Earned");
          const tierClass = `tier-${tierName.toLowerCase()}`;
          return `<span class="modal-status-pill ${tierClass}">🏆 x${p.earnedTierLevel} ${tierName} Earned</span>`;
        }
        return `<span class="modal-status-pill status-earned">✔ Earned</span>`;
      }
      if (p.status === "in-progress") {
        return `<span class="modal-status-pill status-progress">⏱ In Progress</span>`;
      }
      return `<span class="modal-status-pill status-locked">🔒 Locked</span>`;
    }
    if (item.category === "disabled") {
      return `<span class="modal-status-pill status-disabled">⛔ Disabled</span>`;
    }
    if (item.category === "retired") {
      if (p.status === "earned") {
        return `<span class="modal-status-pill status-earned">✔ Earned (Historical Event)</span>`;
      }
      return `<span class="modal-status-pill status-retired">📦 Retired</span>`;
    }
    if (item.category === "internal") {
      return `<span class="modal-status-pill status-internal">🏢 GitHub Staff Only</span>`;
    }
    return `<span class="modal-status-pill status-locked">🔒 Unavailable</span>`;
  }

  function renderProgressCard(item, p, confidenceLevel, isEarned) {
    const isMultiTier = item.tiers && item.tiers.length > 1;

    if (item.category === "earnable" && isMultiTier) {
      let bigCounterHTML = "";
      let trackWidth = 0;
      let pctLabel = "0%";
      let remainingHTML = "";
      const metricLabel = item.metricName
        ? (item.metricName.toLowerCase().startsWith("qualifying")
            ? item.metricName.charAt(0).toUpperCase() + item.metricName.slice(1)
            : `Qualifying ${item.metricName}`)
        : "Qualifying activity";
      const shortMetric = item.id === "pull-shark" ? "qualifying merged PRs" : (item.metricName || "milestones");

      if (p.isMaxTier) {
        const topThresh = item.tiers[item.tiers.length - 1].threshold;
        const countVal = p.currentCount ? p.currentCount.toLocaleString() : `${topThresh.toLocaleString()}+`;
        bigCounterHTML = `<span class="current-num">${countVal}</span> <span class="divider-num">/</span> <span class="target-num">${topThresh.toLocaleString()}</span>`;
        trackWidth = 100;
        pctLabel = "100%";
        remainingHTML = `🏆 <strong>Max Tier Complete</strong> · ${p.earnedTierName} milestone unlocked`;
      } else if (p.currentCount !== null && p.currentCount !== undefined && p.nextThreshold !== null) {
        bigCounterHTML = `<span class="current-num">${p.currentCount.toLocaleString()}</span> <span class="divider-num">/</span> <span class="target-num">${p.nextThreshold.toLocaleString()}</span>`;
        trackWidth = Math.min(100, Math.max(0, p.progressPercent || 0));
        pctLabel = `${trackWidth}%`;
        const nextName = p.nextTier ? `x${p.nextTier.tier} ${p.nextTier.name}` : "Next Tier";
        remainingHTML = `🎯 <strong>${p.remainingCount.toLocaleString()} more</strong> ${shortMetric} to reach ${nextName}.`;
      } else if (isEarned) {
        bigCounterHTML = `<span class="current-num">${p.earnedTierName}</span> <span class="divider-num">Tier</span>`;
        trackWidth = Math.min(100, Math.max(0, p.progressPercent || 0));
        pctLabel = `${trackWidth}%`;
        const nextName = p.nextTier ? `x${p.nextTier.tier} ${p.nextTier.name}` : "Next Tier";
        remainingHTML = `🎯 Target next: ${nextName}`;
      } else {
        const firstThresh = item.tiers[0].threshold;
        bigCounterHTML = `<span class="current-num">0</span> <span class="divider-num">/</span> <span class="target-num">${firstThresh.toLocaleString()}</span>`;
        trackWidth = 0;
        pctLabel = "0%";
        remainingHTML = `🎯 <strong>${firstThresh.toLocaleString()} more</strong> ${shortMetric} to reach x1 ${item.tiers[0].name}.`;
      }

      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.barChart}</span>
              <span>Your Progress</span>
            </div>
            <span class="confidence-pill confidence-${confidenceLevel.toLowerCase()}">${confidenceLevel.replace(/_/g, ' ')}</span>
          </div>
          <div class="progress-big-counter">
            ${bigCounterHTML}
          </div>
          <div class="progress-activity-label">${metricLabel}</div>
          <div class="progress-track-row">
            <div class="modal-progress-track">
              <div class="modal-progress-fill" style="width: ${trackWidth}%;"></div>
            </div>
            <span class="modal-progress-pct">${pctLabel}</span>
          </div>
          <div class="progress-remaining-line">
            ${remainingHTML}
          </div>
        </div>
      `;
    }

    if (item.category === "earnable" && !isMultiTier) {
      const isUnlocked = isEarned || p.status === "earned";
      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.barChart}</span>
              <span>Your Progress</span>
            </div>
            <span class="confidence-pill confidence-${confidenceLevel.toLowerCase()}">${confidenceLevel.replace(/_/g, ' ')}</span>
          </div>
          <div class="progress-big-counter">
            <span class="current-num" style="${isUnlocked ? 'color: #00e676;' : 'color: #94a3b8;'}">${isUnlocked ? '1' : '0'}</span>
            <span class="divider-num">/</span>
            <span class="target-num">1</span>
          </div>
          <div class="progress-activity-label">${item.metricName ? (item.metricName.toLowerCase().startsWith('qualifying') ? item.metricName.charAt(0).toUpperCase() + item.metricName.slice(1) : `Qualifying ${item.metricName}`) : 'Qualifying milestone event'}</div>
          <div class="progress-track-row">
            <div class="modal-progress-track">
              <div class="modal-progress-fill" style="width: ${isUnlocked ? 100 : 0}%;"></div>
            </div>
            <span class="modal-progress-pct">${isUnlocked ? '100%' : '0%'}</span>
          </div>
          <div class="progress-remaining-line">
            ${isUnlocked ? '🏆 <strong>Milestone Complete</strong> · Verified on GitHub profile' : '🎯 Complete the required action to unlock this achievement.'}
          </div>
        </div>
      `;
    }

    if (item.category === "disabled") {
      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.barChart}</span>
              <span>Achievement Status</span>
            </div>
            <span class="confidence-pill confidence-disabled">DISABLED</span>
          </div>
          <div class="progress-big-counter">
            <span class="current-num" style="color: #f87171; font-size: 1.85rem;">⛔ Inactive</span>
          </div>
          <div class="progress-activity-label">Experimental feature tested by GitHub</div>
          <div class="progress-remaining-line" style="color: #94a3b8;">
            ℹ️ <strong>Disabled by GitHub.</strong> Not active for new accounts; preserved for historical records only.
          </div>
        </div>
      `;
    }

    if (item.category === "retired") {
      const isUnlocked = isEarned || p.status === "earned";
      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.barChart}</span>
              <span>Historical Event Status</span>
            </div>
            <span class="confidence-pill confidence-verified">HISTORICAL</span>
          </div>
          <div class="progress-big-counter">
            <span class="current-num" style="${isUnlocked ? 'color: #38bdf8;' : 'color: #94a3b8; font-size: 1.85rem;'}">
              ${isUnlocked ? '✔ Contributor' : '📦 Event Ended'}
            </span>
          </div>
          <div class="progress-activity-label">${isUnlocked ? 'Verified historical milestone contributor' : 'Official event milestone permanently closed'}</div>
          <div class="progress-remaining-line">
            ${isUnlocked ? '🏆 <strong>Historical contributor verified.</strong>' : 'ℹ️ <strong>Event concluded.</strong> Preserved for accounts that contributed during the snapshot.'}
          </div>
        </div>
      `;
    }

    if (item.category === "internal") {
      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.barChart}</span>
              <span>Internal Status</span>
            </div>
            <span class="confidence-pill confidence-internal" style="background: rgba(45, 212, 191, 0.15); color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.35);">STAFF ONLY</span>
          </div>
          <div class="progress-big-counter">
            <span class="current-num" style="color: #2dd4bf; font-size: 1.85rem;">🏢 GitHub Staff</span>
          </div>
          <div class="progress-activity-label">Exclusive internal employee milestone</div>
          <div class="progress-remaining-line" style="color: #94a3b8;">
            ℹ️ <strong>Reserved for GitHub staff.</strong> Excluded from public completion totals.
          </div>
        </div>
      `;
    }

    return "";
  }

  function renderTierMilestonesCard(item, p) {
    const isMultiTier = item.tiers && item.tiers.length > 1;

    if (item.category === "earnable" && isMultiTier) {
      const tierCardsHTML = item.tiers.map((t, idx) => {
        const tierNum = idx + 1;
        const isPassed = p.earnedTierLevel > tierNum;
        const isCurrent = p.earnedTierLevel === tierNum;
        const isNext = p.nextTier && p.nextTier.tier === tierNum;

        let cardClass = "tier-milestone-card";
        let topPill = `x${tierNum}`;

        if (isCurrent) {
          cardClass += ` is-current is-${t.name.toLowerCase()}`;
          topPill = `✔ x${tierNum}`;
        } else if (isPassed) {
          cardClass += " is-passed";
          topPill = `✔ x${tierNum}`;
        } else if (isNext) {
          cardClass += " is-next";
          topPill = `x${tierNum}`;
        } else {
          cardClass += " is-locked";
          topPill = `x${tierNum}`;
        }

        return `
          <div class="${cardClass}">
            <span class="tier-top-pill">${topPill}</span>
            <span class="tier-thresh-num">${t.threshold !== null ? t.threshold.toLocaleString() : '—'}</span>
            <span class="tier-name-label">${t.name}</span>
          </div>
        `;
      }).join("");

      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.layers}</span>
              <span>Tier Milestones</span>
            </div>
          </div>
          <div class="tier-milestones-grid">
            ${tierCardsHTML}
          </div>
        </div>
      `;
    }

    if (item.category === "earnable" && !isMultiTier) {
      const isUnlocked = p.status === "earned";
      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.target}</span>
              <span>Milestone Requirement</span>
            </div>
          </div>
          <div class="single-tier-panel">
            <div class="single-tier-status-box ${isUnlocked ? 'is-earned' : ''}">
              <div>
                <div class="single-tier-title">${isUnlocked ? '✔ Milestone Unlocked & Verified' : '🔒 Single Milestone Requirement'}</div>
                <div class="single-tier-desc">${item.officialRule}</div>
              </div>
              <div style="text-align: right; font-weight: 700; font-size: 0.85rem; color: ${isUnlocked ? '#4ade80' : '#94a3b8'};">
                ${isUnlocked ? '1 / 1 Completed' : '0 / 1 Pending'}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (item.category === "disabled" && item.tiers && item.tiers.length > 0) {
      const tierCardsHTML = item.tiers.map((t, idx) => `
        <div class="tier-milestone-card is-locked" style="opacity: 0.5;">
          <span class="tier-top-pill">x${idx + 1}</span>
          <span class="tier-thresh-num">${t.name}</span>
          <span class="tier-name-label">Inactive</span>
        </div>
      `).join("");

      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.layers}</span>
              <span>Historical Tiers</span>
            </div>
          </div>
          <div class="tier-milestones-grid">
            ${tierCardsHTML}
          </div>
        </div>
      `;
    }

    if (item.category === "retired") {
      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.layers}</span>
              <span>Historic Archive Details</span>
            </div>
          </div>
          <div class="single-tier-panel">
            <div class="single-tier-status-box">
              <div>
                <div class="single-tier-title">Permanent Historical Snapshot</div>
                <div class="single-tier-desc">${item.confidenceDetails || item.officialRule}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (item.category === "internal") {
      return `
        <div class="modal-panel">
          <div class="modal-panel-header">
            <div class="modal-panel-title-group">
              <span class="modal-panel-icon">${MODAL_ICONS.layers}</span>
              <span>Internal Deployment Scope</span>
            </div>
          </div>
          <div class="single-tier-panel">
            <div class="single-tier-status-box">
              <div>
                <div class="single-tier-title">GitHub Proxima Milestone</div>
                <div class="single-tier-desc">${item.officialRule}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return "";
  }

  function renderMilestoneHistoryCard(milestones, unlockedAt) {
    let listHTML = "";

    if (milestones && milestones.length > 0) {
      listHTML = milestones.map(m => {
        const displayUrl = m.url ? (m.url.startsWith("http") ? m.url : `https://github.com${m.url}`) : null;
        const targetText = m.target || m.repo || (m.url ? m.url.replace(/^https?:\/\/github\.com\//, '').replace(/\/pull\//, '#') : "Milestone Contribution");
        const dateText = m.date ? formatMilestoneDate(m.date) : (unlockedAt ? formatMilestoneDate(unlockedAt) : "");

        return `
          <div class="milestone-history-item">
            <div class="milestone-history-left">
              <div class="milestone-history-icon">
                ${MODAL_ICONS.prMerge}
              </div>
              <div class="milestone-history-text">
                ${displayUrl ? `<a href="${displayUrl}" target="_blank" rel="noopener noreferrer" class="milestone-history-link">${targetText}</a>` : `<span class="milestone-history-link">${targetText}</span>`}
                <div class="milestone-history-label">${m.label || 'Qualifying milestone achieved'}</div>
              </div>
            </div>
            <div class="milestone-history-right">
              ${dateText ? `<span>${dateText}</span>` : ''}
              <span style="color: #64748b;">${MODAL_ICONS.external}</span>
            </div>
          </div>
        `;
      }).join("");
    } else {
      listHTML = `<div class="milestone-empty">No publicly verifiable milestone history available.</div>`;
    }

    return `
      <div class="modal-panel">
        <div class="modal-panel-header">
          <div class="modal-panel-title-group">
            <span class="modal-panel-icon">${MODAL_ICONS.clock}</span>
            <span>Verified Milestone History</span>
          </div>
        </div>
        <div class="milestone-history-list">
          ${listHTML}
        </div>
      </div>
    `;
  }

  function renderRightColumn(item) {
    const tips = ACHIEVEMENT_TIPS[item.id] || (item.tip ? [item.tip] : ["Contribute to open-source and follow GitHub community guidelines."]);

    const tipsHTML = tips.map(t => `
      <li>
        <span class="tip-check-icon">✔</span>
        <span>${t}</span>
      </li>
    `).join("");

    return `
      <div class="modal-info-column">
        <div class="modal-info-section">
          <h4><span class="modal-panel-icon">${MODAL_ICONS.book}</span> About</h4>
          <p>${item.description}</p>
        </div>

        <div class="modal-info-section">
          <h4><span class="modal-panel-icon">${MODAL_ICONS.target}</span> Official Requirement</h4>
          <p>${item.officialRule}</p>
        </div>

        <div class="modal-info-section">
          <h4><span class="modal-panel-icon">${MODAL_ICONS.bulb}</span> Strategy & Tips</h4>
          <ul class="tips-checklist">
            ${tipsHTML}
          </ul>
        </div>

        <div class="modal-note-card">
          <span class="note-icon">ⓘ</span>
          <div class="note-text">
            <strong>Note:</strong> GitHub is the sole authority for achievement grants. Badge Quest analyzes public metrics and guides your learning journey honestly.
          </div>
        </div>
      </div>
    `;
  }

  function renderModalFooter(sourceLabel, lastUpdatedTime) {
    return `
      <div class="modal-detail-footer">
        <div class="footer-top-line">
          <span class="footer-source-item">
            ${MODAL_ICONS.github}
            <span>Source: <strong>${sourceLabel}</strong></span>
          </span>
          <span class="footer-separator">|</span>
          <span class="footer-source-item">
            ${MODAL_ICONS.refresh}
            <span>Updated: ${lastUpdatedTime}</span>
          </span>
        </div>
        <p class="footer-disclosure-text">
          Public Search & REST API reflect publicly accessible repositories and events.
        </p>
      </div>
    `;
  }

  function renderBadgeModalHTML(item, currentProfile) {
    const p = item.progress || {};
    const meta = item.detectionMeta || {};
    const act = meta.activity || null;
    const isEarned = p.status === "earned" || p.earnedTierLevel > 0;
    const confidenceLevel = act ? act.confidence : (p.confidence || "VERIFIED");
    const sourceLabel = act ? (act.source === "github-public-search-api" ? "GitHub Public Search API" : (act.source === "github-rest-api" ? "GitHub REST API" : act.source)) : (meta.source || (item.id === "starstruck" ? "GitHub REST API (repos)" : "GitHub Public Activity"));
    const milestones = act?.milestones || meta.milestones || [];
    const unlockedAt = act?.unlockedAt || meta.unlockedAt || null;
    const lastUpdated = currentProfile?.lastUpdated || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    const statusPillHTML = getHeaderStatusPill(item, p);
    const progressCardHTML = renderProgressCard(item, p, confidenceLevel, isEarned);
    const tierMilestonesHTML = renderTierMilestonesCard(item, p);
    const milestoneHistoryHTML = renderMilestoneHistoryCard(milestones, unlockedAt);
    const rightColumnHTML = renderRightColumn(item);
    const footerHTML = renderModalFooter(sourceLabel, lastUpdated);

    return `
      <button type="button" class="modal-close-btn" id="modalCloseBtn" aria-label="Close dialog">&times;</button>
      
      <div class="modal-detail-header">
        <div class="modal-badge-avatar">
          <img src="${p.badgeImg || item.tiers[0].badgeImg}" alt="${item.name} badge artwork">
        </div>
        <div class="modal-header-meta">
          <h2 class="modal-header-title" id="modalBadgeTitle">${item.name}</h2>
          <div class="modal-header-subtitle">
            <span>${item.availability}</span>
            <span>•</span>
            <span>${item.confidence}</span>
          </div>
          <div>
            ${statusPillHTML}
          </div>
        </div>
      </div>

      <div class="modal-detail-body">
        <div class="modal-left-column">
          ${progressCardHTML}
          ${tierMilestonesHTML}
          ${milestoneHistoryHTML}
        </div>
        <div class="modal-right-column">
          ${rightColumnHTML}
        </div>
      </div>

      ${footerHTML}
    `;
  }

  /**
   * Modal dialog handlers.
   */
  function openBadgeModal(badgeId) {
    if (!currentProfile || !currentProfile.catalogue) return;
    const item = currentProfile.catalogue.find(a => a.id === badgeId);
    if (!item) return;

    const modalBadgeCard = document.getElementById("modalBadgeCard");
    if (!modalBadgeCard) return;

    modalBadgeCard.innerHTML = renderBadgeModalHTML(item, currentProfile);
    modalBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeBadgeModal() {
    modalBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openGenericModal(title, bodyHTML) {
    genericModalTitle.textContent = title;
    genericModalBody.innerHTML = bodyHTML;
    genericModalBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeGenericModal() {
    genericModalBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /**
   * Event Listeners Setup
   */
  function initEvents() {
    searchForm.addEventListener("submit", (e) => handleSearch(e, false));
    if (analyzeBtn) analyzeBtn.addEventListener("click", (e) => handleSearch(e, false));
    if (refreshBtn) refreshBtn.addEventListener("click", (e) => handleSearch(e, true));

    // Welcome card suggestions click
    if (welcomeCard) {
      welcomeCard.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-suggest]");
        if (btn) {
          const user = btn.getAttribute("data-suggest");
          usernameInput.value = user;
          handleSearch(null, false);
        }
      });
    }

    // Rate limit header updates
    window.addEventListener("badgequest:ratelimit", handleRateLimitUpdate);

    // Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        currentFilter = btn.getAttribute("data-filter");
        renderAchievementsGrid();
      });
    });

    // Achievement Cards Click (Delegation)
    achievementsGrid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-badge-id]");
      if (card) {
        openBadgeModal(card.getAttribute("data-badge-id"));
      }
    });

    achievementsGrid.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const card = e.target.closest("[data-badge-id]");
        if (card) {
          e.preventDefault();
          openBadgeModal(card.getAttribute("data-badge-id"));
        }
      }
    });

    // Next Up Button Click
    if (btnNextUpDetails) {
      btnNextUpDetails.addEventListener("click", () => {
        if (currentProfile && currentProfile.nextUp) {
          openBadgeModal(currentProfile.nextUp.id);
        }
      });
    }

    // Modal Close
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop || e.target.closest("#modalCloseBtn") || e.target.closest("[data-action='close-modal']")) {
        closeBadgeModal();
      }
    });

    genericModalCloseBtn.addEventListener("click", closeGenericModal);
    genericModalBackdrop.addEventListener("click", (e) => {
      if (e.target === genericModalBackdrop) closeGenericModal();
    });

    // Escape Key to close modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeBadgeModal();
        closeGenericModal();
      }
    });

    // Navigation Links
    document.querySelectorAll("[data-nav-target]").forEach(link => {
      link.addEventListener("click", (e) => {
        const target = link.getAttribute("data-nav-target");
        if (target === "home") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (target === "achievements") {
          e.preventDefault();
          document.getElementById("achievementsSection").scrollIntoView({ behavior: "smooth" });
        } else if (target === "leaderboard") {
          e.preventDefault();
          openGenericModal("Community Leaderboard", `
            <p style="color: #94a3b8; margin-bottom: 16px;">Top open-source contributors with verified GitHub badges:</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:rgba(255,255,255,0.04); border-radius:12px;">
                <span style="font-weight:700;">🥇 @torvalds (Linux)</span>
                <span style="color:#bbf452; font-weight:800;">4,096+ Stars</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:rgba(255,255,255,0.04); border-radius:12px;">
                <span style="font-weight:700;">🥈 @defunkt (Chris Wanstrath)</span>
                <span style="color:#bbf452; font-weight:800;">Pull Shark Gold</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:rgba(255,255,255,0.04); border-radius:12px;">
                <span style="font-weight:700;">🥉 @ayushcmd (Badge Quest)</span>
                <span style="color:#bbf452; font-weight:800;">Active Maintainer</span>
              </div>
            </div>
          `);
        } else if (target === "about") {
          e.preventDefault();
          openGenericModal("About Badge Quest", `
            <p style="color:#cbd5e1; line-height:1.6; margin-bottom:14px;">
              <strong>Badge Quest</strong> is a community learning platform and real-time GitHub Achievement Tracker designed to celebrate open-source builders.
            </p>
            <p style="color:#cbd5e1; line-height:1.6; margin-bottom:14px;">
              <strong>Fair Play & Privacy Notice:</strong> Badge Quest analyzes publicly available profile metrics via the official GitHub REST API. GitHub does not provide an official dedicated achievements REST API. Cross-origin browser restrictions prevent static sites from scraping internal GitHub HTML fragments directly. Starstruck is calculated directly from public repository stars.
            </p>
            <p style="color:#94a3b8; font-size:0.85rem;">
              Built with pure HTML5, CSS3, and Vanilla JavaScript. Fully compatible with GitHub Pages root deployment.
            </p>
          `);
        }
      });
    });
  }

  // Initial Boot
  function init() {
    initEvents();

    // Check if URL has ?user= or ?u= parameter
    const params = new URLSearchParams(window.location.search);
    const urlUser = params.get("user") || params.get("u");
    if (urlUser) {
      usernameInput.value = urlUser;
      handleSearch(null, false);
    } else {
      // Clean initial state: show welcome card and browseable catalogue
      renderInitialCatalogue();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose for testing & debug runner
  window.BadgeQuest = {
    renderProfile,
    handleSearch,
    openBadgeModal,
    closeBadgeModal,
    openGenericModal,
    showToast,
    // Method to load a test scenario programmatically (for audit test suites)
    loadTestScenario: function(scenarioKey) {
      if (window.SAMPLE_PROFILES && window.SAMPLE_PROFILES[scenarioKey]) {
        const prof = window.buildProfileState(window.SAMPLE_PROFILES[scenarioKey]);
        renderProfile(prof);
        return prof;
      }
      return null;
    }
  };
})();
