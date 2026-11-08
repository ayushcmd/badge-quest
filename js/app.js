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
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalBadgeImg = document.getElementById("modalBadgeImg");
  const modalBadgeTitle = document.getElementById("modalBadgeTitle");
  const modalBadgeCategory = document.getElementById("modalBadgeCategory");
  const modalBadgeDesc = document.getElementById("modalBadgeDesc");
  const modalRuleText = document.getElementById("modalRuleText");
  const modalTierLadder = document.getElementById("modalTierLadder");
  const modalProgressBox = document.getElementById("modalProgressBox");
  const modalTipText = document.getElementById("modalTipText");

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

      // Micro progress or CORS inspection note
      let microProgressHTML = "";
      if (item.id === "starstruck" && p.currentCount !== null && p.currentCount !== undefined) {
        const repoNote = item.detectionMeta && item.detectionMeta.bestRepoName
          ? `Top: "${item.detectionMeta.bestRepoName}"`
          : `${p.currentCount} stars`;
        if (p.isMaxTier) {
          microProgressHTML = `
            <div class="card-micro-progress" title="${repoNote}">
              <div class="micro-progress-bar"><div class="micro-progress-fill" style="width: 100%; background: #facc15;"></div></div>
              <div class="micro-progress-text" style="color: #facc15;">Max Tier Complete</div>
            </div>`;
        } else if (p.nextTier && p.nextThreshold) {
          microProgressHTML = `
            <div class="card-micro-progress" title="${repoNote}">
              <div class="micro-progress-bar"><div class="micro-progress-fill" style="width: ${p.progressPercent}%;"></div></div>
              <div class="micro-progress-text">${p.currentCount} / ${p.nextThreshold} (${p.remainingCount} left)</div>
            </div>`;
        }
      } else if (!p.isMaxTier && p.nextTier && p.remainingCount !== null && p.remainingCount > 0 && p.nextThreshold !== null && p.currentCount !== null) {
        microProgressHTML = `
          <div class="card-micro-progress" title="${p.progressSummary}">
            <div class="micro-progress-bar">
              <div class="micro-progress-fill" style="width: ${p.progressPercent}%;"></div>
            </div>
            <div class="micro-progress-text">${p.currentCount} / ${p.nextThreshold} (${p.remainingCount} left)</div>
          </div>
        `;
      } else if (p.isMaxTier) {
        microProgressHTML = `
          <div class="card-micro-progress" title="Max Tier Complete">
            <div class="micro-progress-bar">
              <div class="micro-progress-fill" style="width: 100%; background: #facc15;"></div>
            </div>
            <div class="micro-progress-text" style="color: #facc15;">Max Tier Complete</div>
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
   * Modal dialog handlers.
   */
  function openBadgeModal(badgeId) {
    if (!currentProfile) return;
    const item = currentProfile.catalogue.find(a => a.id === badgeId);
    if (!item) return;

    modalBadgeImg.src = item.progress.badgeImg;
    modalBadgeTitle.textContent = item.name;
    modalBadgeCategory.textContent = `${item.availability} • ${item.confidence}`;
    modalBadgeDesc.textContent = item.description;
    modalRuleText.textContent = item.officialRule;
    modalTipText.textContent = item.tip;

    // Render Tier Ladder
    if (item.tiers && item.tiers.length > 0) {
      modalTierLadder.innerHTML = item.tiers.map((t, idx) => {
        const isEarned = item.progress.earnedTierLevel >= (idx + 1);
        const isCurrent = item.progress.earnedTierLevel === (idx + 1);
        const isNext = item.progress.nextTier && item.progress.nextTier.tier === t.tier;

        let tierClass = "is-locked";
        let tierPillText = t.label || `Tier ${t.tier}`;

        if (isCurrent) {
          tierClass = "is-current";
          tierPillText = `✔ Current: ${t.name}`;
        } else if (isEarned) {
          tierClass = "is-passed";
          tierPillText = `✔ Passed`;
        } else if (isNext) {
          tierClass = "is-next";
          tierPillText = `🎯 Next Target`;
        }

        return `
          <div class="tier-step ${tierClass}">
            <div class="tier-step-dot">${t.tier}</div>
            <div class="tier-step-name">${t.name}</div>
            <div class="tier-step-thresh">${t.threshold !== null ? t.threshold.toLocaleString() : 'Special'}</div>
            <div class="tier-step-pill">${tierPillText}</div>
          </div>
        `;
      }).join("");
    } else {
      modalTierLadder.innerHTML = `<p style="color:#94a3b8; font-size:0.85rem;">Single milestone achievement.</p>`;
    }

    // Render User Progress Details
    const p = item.progress;
    let progressBoxHTML = "";
    if (p.isMaxTier) {
      progressBoxHTML = `
        <div style="background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.3); border-radius: 12px; padding: 14px; margin-top: 14px;">
          <strong style="color: #facc15;">🏆 Maximum Tier Achieved!</strong>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">You have achieved the highest tier (${p.earnedTierName} x${p.earnedTierLevel}) for this achievement.</p>
        </div>
      `;
    } else if (item.id === "starstruck" && item.detectionMeta && item.detectionMeta.bestRepoName) {
      progressBoxHTML = `
        <div style="background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); border-radius: 12px; padding: 14px; margin-top: 14px;">
          <strong style="color: #4ade80;">⭐ Verified via Public REST API</strong>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">
            Highest starred public repository: <strong><a href="${item.detectionMeta.bestRepoUrl}" target="_blank" style="color:#bbf452;">${item.detectionMeta.bestRepoName}</a></strong> with <strong>${item.detectionMeta.count.toLocaleString()}</strong> stars.
          </p>
          <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px;">${p.progressSummary}</p>
        </div>
      `;
    } else if (p.corsRestricted) {
      const username = currentProfile.username || "username";
      progressBoxHTML = `
        <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 14px; margin-top: 14px;">
          <strong style="color: #38bdf8;">🌐 Browser CORS Limitation</strong>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px; line-height: 1.5;">
            GitHub restricts direct client-side scraping of user achievement fragments on static websites.
          </p>
          <div style="margin-top: 10px;">
            <a href="https://github.com/${encodeURIComponent(username)}?tab=achievements" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.4); border-radius:999px; color:#38bdf8; font-weight:700; font-size:0.8rem; text-decoration:none;">
              Open @${username}'s Achievements on GitHub ↗
            </a>
          </div>
        </div>
      `;
    } else if (p.status === "earned" && p.nextTier) {
      const progressDetailText = p.currentCount !== null && p.remainingCount !== null
        ? `<p style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">Current Progress: ${p.currentCount} / ${p.nextThreshold} ${item.metricName || 'units'}</p>
           <p style="font-size: 0.85rem; color: #facc15; margin-top: 4px;">${p.remainingCount} more ${item.metricName || 'units'} to reach x${p.nextTier.tier} ${p.nextTier.name}.</p>`
        : `<p style="font-size: 0.85rem; color: #facc15; margin-top: 4px;">Next milestone target: x${p.nextTier.tier} ${p.nextTier.name} (${p.nextTier.threshold} ${item.metricName || 'units'}).</p>
           <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Numerical activity count between tiers is private to the profile owner.</p>`;

      progressBoxHTML = `
        <div style="background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); border-radius: 12px; padding: 14px; margin-top: 14px;">
          <strong style="color: #4ade80;">Status: Verified Earned ${p.earnedTierName} tier!</strong>
          ${progressDetailText}
        </div>
      `;
    } else {
      progressBoxHTML = `
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 14px; margin-top: 14px;">
          <strong style="color: #cbd5e1;">Status: ${p.status === 'earned' ? 'Earned' : 'Locked'}</strong>
          <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 4px;">${p.progressSummary}</p>
        </div>
      `;
    }
    modalProgressBox.innerHTML = progressBoxHTML;

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
    modalCloseBtn.addEventListener("click", closeBadgeModal);
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeBadgeModal();
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
