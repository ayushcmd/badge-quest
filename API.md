# Badge Quest — Technical Architecture & GitHub API Specification

> **Platform:** GitHub Pages Static Client (HTML5, CSS3, Vanilla JavaScript ES6+)  
> **Backend:** 100% Client-Side. No server, no database, no Cloudflare Worker, no proxies, no API keys required.  
> **Status:** Authoritative public implementation.

---

## 1. System Architecture Overview

Badge Quest is designed as a zero-dependency, client-side web application hosted directly from the repository root on GitHub Pages. It enables any visitor to enter a public GitHub username, analyze public GitHub REST API metrics, evaluate multi-tier achievement progress, and inspect the complete GitHub Achievement Catalogue.

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                         │
│                                                             │
│   ┌──────────────┐   ┌───────────────────────────────┐      │
│   │  index.html  │──▶│      js/app.js (UI Logic)     │      │
│   └──────────────┘   └──────────────┬────────────────┘      │
│                                     │                       │
│        ┌────────────────────────────┼──────────────────┐    │
│        ▼                            ▼                  ▼    │
│  ┌───────────────┐         ┌─────────────────┐   ┌────────┐ │
│  │js/github-api.js│        │js/achievement-  │   │js/     │ │
│  │(REST Client & │         │   detector.js   │   │data.js │ │
│  │ Rate Limiter) │         │(CORS & Starstruck│  │(Catalogue│
│  └───────┬───────┘         │  Verification)  │   │& Tiers)│ │
│          │                 └─────────────────┘   └────────┘ │
└──────────┼──────────────────────────────────────────────────┘
           │ Unauthenticated HTTPS Fetch (CORS: *)
           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Official GitHub REST API                     │
│                https://api.github.com/                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. GitHub REST API Endpoints Used

All requests use GitHub's unauthenticated public REST API v3 with `Accept: application/vnd.github.v3+json`.

| Endpoint | HTTP Method | Purpose |
| :--- | :---: | :--- |
| `https://api.github.com/users/{username}` | `GET` | Fetches core profile metadata: avatar URL, display name, bio, public repository count, followers, following, creation date, and profile URL. |
| `https://api.github.com/users/{username}/repos?per_page=100&sort=pushed` | `GET` | Analyzes public repository star counts (`stargazers_count`) to verify the **Starstruck** achievement tier and identify the user's top repository. |

---

## 3. Rate Limit Management & Header Inspection

Unauthenticated requests to the GitHub REST API are rate-limited to **60 requests per hour per originating IP address**.

Badge Quest dynamically captures and responds to rate limit headers returned by GitHub:

- `x-ratelimit-limit`: Maximum allowable requests per hour window (60).
- `x-ratelimit-remaining`: Remaining allowable requests in the current window.
- `x-ratelimit-reset`: Unix epoch timestamp when the rate limit window resets.

### Handling Strategy:
1. **Live Header Indicator:** The top navigation bar displays a live quota indicator (e.g. `API Quota: 58/60`).
2. **Visual Warning:** When quota drops to 10 or fewer requests, the indicator turns yellow; when exhausted (0), it turns red.
3. **HTTP 403 / 429 Handling:** When the limit is reached, Badge Quest catches the error, parses the reset timestamp, and displays an exact friendly countdown (e.g. `Rate limit reached. Resets at 3:45 PM`).
4. **Zero Token Requirement:** Badge Quest never prompts users to provide their own Personal Access Token (PAT).

---

## 4. Browser-Side Caching

To conserve the 60 req/hr IP rate limit:
- Successful API responses are cached in browser `sessionStorage` with key `bq_cache_{username}`.
- **Cache TTL:** 15 minutes (900,000 ms).
- If a user searches the same username within 15 minutes, the result renders instantly with a `Cached (Instant)` badge.
- **Refresh Control:** A dedicated **Refresh** button bypasses the cache, forcing a fresh query to GitHub and updating the cache with latest metrics.

---

## 5. Achievement Detection & Browser CORS Boundaries

### The Technical Limitation
GitHub does **not** provide an official public REST or GraphQL endpoint for user achievement badges. 

While individual achievement HTML fragments exist at `https://github.com/users/{username}/achievements/{slug}/detail`, **GitHub's web servers strictly restrict cross-origin requests from client-side JavaScript on external domains (including static GitHub Pages)**. 

Direct `fetch()` calls from the browser result in standard CORS errors (`TypeError: Failed to fetch`).

### Strict Honest Implementation:
1. **No Unauthorized Proxies:** Per security guidelines, Badge Quest does not route user queries through unverified, public third-party CORS proxy websites.
2. **No Data Fabrication:** Badge Quest never fabricates unverified badge data or claims all achievements were checked when browser security blocks the request.
3. **Verified REST Detection (Starstruck):**
   - **Starstruck** is 100% verified using public repository star counts retrieved directly via `https://api.github.com/users/{username}/repos`.
   - The tier ladder is computed against known thresholds (16 / 128 / 512 / 4,096 stars on a single repository).
4. **CORS Disclosure & Direct Links:**
   - Other earnable achievements (Pull Shark, Pair Extraordinaire, Galaxy Brain, Finishing Touch, Quickdraw, YOLO, Public Sponsor) display an honest `Check on GitHub` indicator.
   - Each card provides a direct link: `Open @{username}'s Achievements on GitHub ↗` (`https://github.com/{username}?tab=achievements`).
5. **Modular Architecture for Future Backends:**
   - Achievement detection is isolated in [`js/achievement-detector.js`](file:///c:/Projects/AYUSHCMD-GITHUB/badge-quest/js/achievement-detector.js).
   - If an optional backend or Cloudflare Worker proxy is deployed in the future, configuring `window.BADGE_QUEST_BACKEND_URL` automatically routes detection through that endpoint without modifying frontend UI code.

---

## 6. Multi-Tier Milestone Ladders

The tier calculation engine in [`js/achievements-data.js`](file:///c:/Projects/AYUSHCMD-GITHUB/badge-quest/js/achievements-data.js) evaluates:

$$\text{Remaining Units} = \max(0, \text{Next Tier Threshold} - \text{Current Count})$$

| Achievement | x1 Default | x2 Bronze | x3 Silver | x4 Gold | Confidence Level |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Pull Shark** | 2 | 16 | 128 | 1,024 | Official threshold |
| **Starstruck** | 16 | 128 | 512 | 4,096 | Official threshold *(single repo)* |
| **Pair Extraordinaire** | 1 | 10 | 24 | 48 | Official threshold |
| **Galaxy Brain** | 2 | 8 | 16 | 32 | Official threshold *(Discussions)* |
| **Finishing Touch** | 1 | 4 | 16 | 32 | Community-observed |
| **Quickdraw** | 1 | — | — | — | Official single-tier |
| **YOLO** | 1 | — | — | — | Official single-tier |
| **Public Sponsor** | 1 | — | — | — | Official single-tier |

---

## 7. Public Completion Denominator

$$\text{Completion Percentage} = \frac{\text{Earned Currently Earnable Achievements}}{8} \times 100\%$$

Strict exclusions from the completion denominator:
- **Retired Achievements (2):** Arctic Code Vault Contributor, Mars 2020 Contributor (awarded as bonus historical achievements when present).
- **Disabled Achievements (2):** Heart On Your Sleeve, Open Sourcerer (deprecated / not earnable).
- **Internal Staff Achievements (3):** Proxima Pioneer, Staffshipper, Staffuser (restricted to GitHub staff).
- **Informational Profile Badges (5):** Developer Program Member, GitHub Pro, Bug Bounty Hunter, Campus Expert, Security Advisory Credit (separate program highlights).

---

## 8. GitHub Pages Root Deployment

Badge Quest runs directly from the repository root:
- `index.html` (Application entrypoint)
- `css/dashboard.css` (Visual identity and responsive layout)
- `js/achievements-data.js` (Catalogue data and tier engine)
- `js/achievement-detector.js` (Modular detection engine)
- `js/github-api.js` (REST API client and rate limit manager)
- `js/app.js` (Application controller)
- `assets/` (Badge images and mascot)

Legacy documentation remains preserved in `/docs` without interfering with root deployment.
