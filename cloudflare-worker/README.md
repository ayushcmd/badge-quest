# Badge Quest — Cloudflare Worker API

A lightweight, serverless Cloudflare Worker for **Badge Quest** that provides server-side retrieval and normalization of publicly accessible GitHub achievement pages.

Designed to overcome client-side browser CORS restrictions on static GitHub Pages hosting.

---

## Architecture Overview

```
GitHub Pages Frontend (Static)
          │
          ├── (1) Direct REST API (Profile, Repositories, Starstruck)
          │     └── https://api.github.com/
          │
          └── (2) Hybrid Achievement Detection
                └── Cloudflare Worker (badgequest-api)
                          │
                          ├── GET https://github.com/:username?tab=achievements
                          └── GET https://github.com/users/:username/achievements/:slug/detail
```

### Core Responsibilities
1. **Public Page Retrieval:** Fetches `https://github.com/:username?tab=achievements` with standard web headers.
2. **HTML Parsing:** Extracts earned badges, slugs, and earned tier levels (`default`, `bronze`, `silver`, `gold`).
3. **Detail Fragment Inspection:** Parses `/users/:user/achievements/:slug/detail?hovercard=1` to extract milestone records and unlock timestamps.
4. **Data Normalization:** Maps detected items against Badge Quest's authoritative 15-achievement catalogue.
5. **Caching:** Uses Cloudflare Cache API (`caches.default`) with a 15-minute TTL (`Cache-Control: public, max-age=900`).
6. **CORS Security:** Restricts access to authorized origins (`https://ayushcmd.github.io`, `http://localhost:8000`).

---

## API Endpoints

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "badgequest-api",
  "version": "1.0.0",
  "timestamp": "2026-11-08T11:15:00.000Z",
  "environment": "production"
}
```

### 2. Achievement Collection Analysis
```http
GET /api/analyze/:username
GET /api/achievements/:username
```
**Parameters:**
- `:username` (string): Valid GitHub username (alphanumeric with single hyphens, max 39 chars).

**Response (Example for user with public achievements):**
```json
{
  "success": true,
  "username": "ayushcmd",
  "source": "github-public-achievement-pages",
  "hasPublicAchievements": true,
  "lastUpdated": "2026-11-08T11:15:00.000Z",
  "achievements": [
    {
      "id": "pull-shark",
      "name": "Pull Shark",
      "category": "earnable",
      "status": "VERIFIED_EARNED",
      "earnedTier": {
        "index": 2,
        "name": "Bronze"
      },
      "nextTier": {
        "index": 3,
        "name": "Silver",
        "threshold": 128
      },
      "progress": null,
      "confidence": "VERIFIED",
      "sourceUrl": "https://github.com/ayushcmd?tab=achievements",
      "badgeAssetUrl": "https://github.githubassets.com/assets/pull-shark-bronze-a37accb528d1.png"
    }
  ],
  "metadata": {
    "method": "public-page-parsing",
    "unofficial": true,
    "earnableCount": 7,
    "totalEarnable": 8,
    "limitations": [
      "GitHub does not provide a dedicated official achievements REST API.",
      "Achievement visibility requires user to have enabled 'Show Achievements on profile' in GitHub settings."
    ]
  }
}
```

### 3. Single Achievement Detail
```http
GET /api/achievements/:username/:slug
```
**Parameters:**
- `:username` (string): GitHub username.
- `:slug` (string): Known achievement slug (e.g. `pull-shark`, `starstruck`, `galaxy-brain`).

**Response (Example):**
```json
{
  "success": true,
  "username": "ayushcmd",
  "slug": "pull-shark",
  "status": "VERIFIED_EARNED",
  "tierIndex": 2,
  "tierName": "Bronze",
  "description": "@ayushcmd opened pull requests that have been merged.",
  "unlockedAt": "2026-03-07T06:33:59Z",
  "milestones": [
    {
      "url": "/ayushcmd/aqi-powerbi-dashboard/pull/1",
      "target": "ayushcmd/aqi-powerbi-dashboard#1",
      "label": "2nd pull request merged"
    },
    {
      "url": "/raghavpush/forex-time-machine/pull/15",
      "target": "raghavpush/forex-time-machine#15",
      "label": "16th pull request merged"
    }
  ]
}
```

---

## Local Development & Testing

Run unit & integration tests:
```bash
node scratch/test_worker_local.js
```

Start the local Wrangler development server:
```bash
cd cloudflare-worker
npx wrangler dev
```

---

## Deployment Instructions

Authenticate with Cloudflare (if not already logged in):
```bash
wrangler login
```

Verify your active account:
```bash
wrangler whoami
```

Deploy the Worker to Cloudflare:
```bash
cd cloudflare-worker
wrangler deploy
```
