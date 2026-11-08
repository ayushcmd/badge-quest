# Contributing

Thanks for helping keep Badge Quest accurate.

## What helps most

- Corrections when GitHub changes a badge rule, tier number or settings path.
- Clearer wording in the guides.
- New quiz questions for the site.
- Accessibility and mobile fixes.

## Before you open a pull request

1. Check the change against a GitHub source, such as GitHub Docs or a staff reply in the GitHub Community discussions, and add it to `guides/sources.md`.
2. If you change a badge rule, update all three places that hold it: the matching file in `guides/`, the cheat sheet table in `README.md`, and the entry in `docs/js/data.js`.
3. Keep the site free of external dependencies and keep it working when opened straight from the file system.
4. Do not add GitHub's own badge artwork. The site uses original icons.

## Style

- Plain, short sentences. Write for someone who has never made a pull request.
- No emoji in the site or in the guides.
- Say when something is uncertain instead of guessing.

## Local preview

```bash
cd docs
python3 -m http.server 8000
```
