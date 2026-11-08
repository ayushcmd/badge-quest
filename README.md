# Badge Quest ✦ GitHub Achievement Tracker

A community learning platform and real-time GitHub Achievement Tracker: discover what each achievement needs, track your public progress honestly, and inspect milestone tiers.

Hosted statically on **GitHub Pages** with **100% client-side HTML5, CSS3, and Vanilla JavaScript**.

No login, no Personal Access Token (PAT), no backend, and no third-party trackers required.

---

## 🚀 Live Tracker Features

- **Real-Time Username Analysis:** Enter any public GitHub username to inspect their live profile, public repositories, and star counts.
- **Starstruck Tier Verification:** Automatically evaluates your top public repository's stars against official Starstruck thresholds (16 / 128 / 512 / 4,096 stars).
- **15-Achievement Catalogue:**
  - **Currently Earnable (8):** Pull Shark, Starstruck, Pair Extraordinaire, Galaxy Brain, Quickdraw, YOLO, Public Sponsor, Finishing Touch.
  - **Disabled / Historical (2):** Heart On Your Sleeve, Open Sourcerer.
  - **Retired Events (2):** Arctic Code Vault Contributor (02/02/2020), Mars 2020 Contributor (Ingenuity mission).
  - **Internal GitHub Staff (3):** Proxima Pioneer, Proxima Staffshipper, Proxima Staffuser.
- **Separate Program Badges (5):** Informational cards for GitHub Developer Program Member, GitHub Pro, Security Bug Bounty Hunter, Campus Expert, and Security Advisory Credit.
- **Multi-Tier Milestone Calculations:** Computes exact tiers (x1 Default, x2 Bronze, x3 Silver, x4 Gold), remaining units to the next milestone, and maximum tier completions.
- **Honest Browser CORS Disclosure:** Explains browser cross-origin boundaries on static sites and provides direct one-click links to your GitHub profile achievements page (`?tab=achievements`).
- **Quota Management & Caching:** Live rate limit quota pill, graceful 403 handling with reset countdown, and 15-minute in-browser caching with a manual Refresh button.

---

## 🛠️ Technology Stack & Hosting

- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript ES6+.
- **Dependencies:** Zero external npm packages, frameworks, or build steps.
- **Deployment:** GitHub Pages served from the **repository root** (`/`).
- **API:** Official GitHub REST API (`https://api.github.com/`).
- **Documentation:** See [API.md](API.md) for full technical architecture and specifications.

### Running Locally

Serve the repository root using any static HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .
```

Then open `http://localhost:8000` in your web browser.

---

## 🏆 GitHub Achievement Cheat Sheet

| Achievement | How to Earn | Known Milestone Thresholds | Status |
| :--- | :--- | :--- | :--- |
| **Starstruck** | A single repository you created and own receives stars | **x1:** 16 \| **x2:** 128 \| **x3:** 512 \| **x4:** 4,096 | Currently Earnable |
| **Pull Shark** | Pull requests you opened are reviewed and merged | **x1:** 2 \| **x2:** 16 \| **x3:** 128 \| **x4:** 1,024 | Currently Earnable |
| **Pair Extraordinaire** | Co-authored commits in pull requests that get merged | **x1:** 1 \| **x2:** 10 \| **x3:** 24 \| **x4:** 48 | Currently Earnable |
| **Galaxy Brain** | Discussion replies accepted as answers | **x1:** 2 \| **x2:** 8 \| **x3:** 16 \| **x4:** 32 | Currently Earnable *(Repo Discussions)* |
| **Finishing Touch** | Authored a merged pull request that refined UI quality | **x1:** 1 \| **x2:** 4 \| **x3:** 16 \| **x4:** 32 *(community-observed)* | Currently Earnable |
| **Quickdraw** | Closed an issue or pull request within 5 minutes | Single milestone | Currently Earnable |
| **YOLO** | Merged a pull request without code review | Single milestone | Currently Earnable |
| **Public Sponsor** | Sponsoring an open-source contributor via GitHub Sponsors | Single milestone | Currently Earnable |
| **Arctic Code Vault** | Contributed code to a repo preserved in Arctic Vault (2020) | Snapshot event | Retired / Event ended |
| **Mars 2020** | Contributed to a repo used in NASA Mars 2020 Ingenuity | Mission event | Retired / Event ended |
| **Heart On Your Sleeve** | Experimental emoji reactions milestone | Unknown | Disabled / Deprecated |
| **Open Sourcerer** | Experimental multi-repo contribution milestone | Unknown | Disabled / Deprecated |
| **Proxima (Pioneer / Shipper / User)** | Internal GitHub Next Proxima testing and shipping milestones | Staff only | Internal / Staff Only |

---

## 📚 Educational Guides

Detailed reference guides are available in the [`guides/`](guides/) directory:

| File | Topic |
| :--- | :--- |
| [00-overview.md](guides/00-overview.md) | What achievements are and how they work |
| [01-profile-and-visibility.md](guides/01-profile-and-visibility.md) | Where badges show up and how to show or hide them |
| [02-quickdraw.md](guides/02-quickdraw.md) | Quickdraw deep-dive |
| [03-pull-shark.md](guides/03-pull-shark.md) | Pull Shark deep-dive |
| [04-yolo.md](guides/04-yolo.md) | YOLO deep-dive |
| [05-pair-extraordinaire.md](guides/05-pair-extraordinaire.md) | Pair Extraordinaire deep-dive |
| [06-starstruck.md](guides/06-starstruck.md) | Starstruck deep-dive |
| [07-galaxy-brain.md](guides/07-galaxy-brain.md) | Galaxy Brain deep-dive |
| [08-public-sponsor.md](guides/08-public-sponsor.md) | Public Sponsor deep-dive |
| [09-troubleshooting.md](guides/09-troubleshooting.md) | Troubleshooting badge visibility |
| [10-retired-and-unreleased.md](guides/10-retired-and-unreleased.md) | Retired, unreleased, and internal staff badges |
| [11-fair-play.md](guides/11-fair-play.md) | Community fair-play guidelines |
| [sources.md](guides/sources.md) | Research sources & references |

---

## ⚖️ Fair Play & Attribution

Achievements are a celebration of genuine open-source collaboration, not a target for automation or spam. Please review [11-fair-play.md](guides/11-fair-play.md).

For third-party acknowledgments, research credits, and intellectual property notices, see [ATTRIBUTION.md](ATTRIBUTION.md).

---

## 📄 License

Badge Quest source code and documentation are released under the [MIT License](LICENSE).  
Copyright (c) 2026 Badge Quest contributors.
