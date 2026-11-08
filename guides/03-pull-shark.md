# Pull Shark

## The rule

Open pull requests that get merged.

## Tiers

| Default | Bronze | Silver | Gold |
| --- | --- | --- | --- |
| 2 | 16 | 128 | 1024 |

The number is the count of your pull requests that were merged.

## Difficulty

Easy to start, long to master.

## Steps for the first two merged pull requests

1. Use a public repository you own. A practice repository with a README on the `main` branch is enough.
2. Create a branch.

   ```bash
   git checkout -b practice-1
   ```

3. Change a file, commit and push.

   ```bash
   echo "Practice note 1" >> notes.md
   git add notes.md
   git commit -m "Add practice note 1"
   git push -u origin practice-1
   ```

4. On GitHub, click Compare and pull request. Make sure the base is `main`, then click Create pull request.
5. Click Merge pull request, then Confirm merge.
6. Do it once more with a second branch such as `practice-2`.
7. Wait up to 24 hours.

Merging your own pull requests in your own repository counts. The pull request has to be merged, not just opened.

## Climbing the tiers with real work

Practice pull requests get you the first tier. After that, the honest way up is useful contributions:

- Fix typos and unclear sentences in documentation of tools you use.
- Improve a README with setup steps you had to figure out.
- Add a missing test or fix a small bug listed as a good first issue.

Small, genuine pull requests are welcome and they add up. Read each project's contributing guide first.

## Common mistakes

- Leaving the pull request open. Open is not merged.
- Committing with an email that is not verified on your account.
- Doing all the work in a fork and never opening a pull request to the parent repository.
- Merging into a branch that is not the default branch. Badges follow merges into the default branch.

## Fair play

Do not flood other projects with empty or pointless pull requests to reach a higher tier. Maintainers have to review them, and it wastes their time.
