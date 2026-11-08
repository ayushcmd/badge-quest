# Troubleshooting: Why a Badge Might Not Appear

Work through this checklist in order.

## 1. Processing time

Badges can take up to 24 hours to appear. Wait a full day, then check your profile in a private or incognito window to rule out cache problems.

## 2. Private contributions

Activity in private repositories does not count unless private contributions are turned on. Open your profile, click Contribution settings above the calendar, and turn on Private contributions. Details stay anonymized. See [01-profile-and-visibility.md](01-profile-and-visibility.md).

## 3. Forks

Work done only in a fork does not count. Pull requests or issues inside a fork do not trigger achievements. To make the work count, open a pull request that gets merged into the parent repository.

## 4. Email verification

Commits tied to an unverified email are not recognized.

```bash
git config user.email
```

If that address is not listed and verified under Settings, Emails, add and verify it.

## 5. Branches

Commits on a non-default branch do not count until they are merged into the default branch, usually `main` or `master`. If your default branch changed, check the repository settings.

## 6. One-time badges

Quickdraw, YOLO and Public Sponsor are awarded once. If you already have one, it will not appear again.

## 7. The criteria themselves

Re-read the guide for your badge. A pull request that is open is not merged. A reply that is not marked as the answer is not accepted. A private sponsorship is not public.

## 8. Ask GitHub

If everything above checks out and 24 hours have passed, contact [GitHub Support](https://support.github.com/).

## Quick reference

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Just did it, nothing yet | Processing delay | Wait up to 24 hours |
| Work was in a private repository | Private contributions off | Turn on Private contributions |
| Merged only inside my fork | Fork work does not count | Merge a pull request into the parent repository |
| Commits not linked to me | Unverified email | Verify the email in Settings |
| Work is on a feature branch | Not merged to default branch | Merge into the default branch |
| Quickdraw or YOLO not showing again | One-time badge | Nothing to fix |
