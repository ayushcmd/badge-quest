# Badge Quest

A learning repo about GitHub Achievements: what each badge needs, how to earn it the honest way, and a small game-style website that walks you through every step.

There are two parts:

- `guides/` holds plain Markdown notes, one file per badge, plus troubleshooting, visibility settings and fair-play rules.
- `docs/` holds the learning site, built with plain HTML, CSS and JavaScript. No build step, no dependencies. It is ready for GitHub Pages.

Information last checked: 8 November 2026.

## The learning site

The site turns the guides into nine short levels. Each level has a briefing, real steps to do on GitHub, and a short quiz. Finish the steps and pass the quiz to put a medal on your shelf. Progress is saved in your own browser with `localStorage`, so there is no account and no server.

Extra tools on the site:

- Tier Planner: type in your count (merged pull requests, stars, accepted answers, co-authored pull requests) and see your tier and what is left to the next one.
- Archive: retired badges, unreleased badges and profile highlights that are not achievements.

### Run it locally

Open `docs/index.html` in a browser, or serve the folder:

```bash
cd docs
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

### Publish it on GitHub Pages

1. Push this repository to GitHub.
2. Open the repository, then Settings, then Pages.
3. Under Build and deployment, choose Deploy from a branch.
4. Pick the `main` branch and the `/docs` folder, then click Save.
5. After a minute or two the site appears at `https://<your-username>.github.io/<repository-name>/`.

All links inside the site are relative, so it works under a project path without changes.

## Badge cheat sheet

| Badge | How to earn it | Tiers (Default / Bronze / Silver / Gold) | Status |
| --- | --- | --- | --- |
| Starstruck | A single repository you created receives stars | 16 / 128 / 512 / 4096 stars | Earnable |
| Quickdraw | Close an issue or pull request within 5 minutes of opening it | One-time | Earnable |
| Pair Extraordinaire | Co-authored commits in pull requests that get merged | 1 / 10 / 24 / 48 pull requests | Earnable |
| Pull Shark | Open pull requests that get merged | 2 / 16 / 128 / 1024 pull requests | Earnable |
| Galaxy Brain | Replies accepted as answers in GitHub Discussions | 2 / 8 / 16 / 32 answers | Earnable, but not in GitHub's own Community forum |
| YOLO | Merge a pull request without code review | One-time | Earnable |
| Public Sponsor | Sponsor a contributor or project through GitHub Sponsors | One-time | Earnable (costs real money) |
| Arctic Code Vault Contributor | Code in the 2020 GitHub Archive Program snapshot | Not applicable | Retired |
| Mars 2020 Contributor | Code in repositories used by the Mars 2020 helicopter mission | Not applicable | Retired |
| Heart On Your Sleeve, Open Sourcerer | Listed in badge assets, no published criteria | Unknown | Not released |

## Guides

| File | Topic |
| --- | --- |
| [00-overview.md](guides/00-overview.md) | What achievements are and how they work |
| [01-profile-and-visibility.md](guides/01-profile-and-visibility.md) | Where badges show up and how to show or hide them |
| [02-quickdraw.md](guides/02-quickdraw.md) | Quickdraw |
| [03-pull-shark.md](guides/03-pull-shark.md) | Pull Shark |
| [04-yolo.md](guides/04-yolo.md) | YOLO |
| [05-pair-extraordinaire.md](guides/05-pair-extraordinaire.md) | Pair Extraordinaire |
| [06-starstruck.md](guides/06-starstruck.md) | Starstruck |
| [07-galaxy-brain.md](guides/07-galaxy-brain.md) | Galaxy Brain |
| [08-public-sponsor.md](guides/08-public-sponsor.md) | Public Sponsor |
| [09-troubleshooting.md](guides/09-troubleshooting.md) | Why a badge might not appear |
| [10-retired-and-unreleased.md](guides/10-retired-and-unreleased.md) | Retired badges, unreleased badges, profile highlights |
| [11-fair-play.md](guides/11-fair-play.md) | Earning badges without spamming or breaking rules |
| [sources.md](guides/sources.md) | Where this information comes from |

## Fair play

Badges are a side effect of real work, not the goal. Do not create extra accounts, spam repositories with empty pull requests, or buy stars. Read [11-fair-play.md](guides/11-fair-play.md) before you start.

## Contributing

Criteria change over time. If you spot something outdated, open an issue or a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

Badge Quest is a community learning project. It is not made by, endorsed by or affiliated with GitHub. The badge artwork on the site is original and only meant to illustrate the levels. Always check GitHub's own pages when accuracy matters.

## License

MIT. See [LICENSE](LICENSE).
