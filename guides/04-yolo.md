# YOLO

## The rule

Merge a pull request without code review.

## Tiers

None. YOLO is a one-time badge.

## Difficulty

Very easy.

## Steps

1. Use a repository you own where no rule requires approvals before merging. A fresh practice repository is fine.
2. Create a branch, change a file, commit and push.

   ```bash
   git checkout -b yolo-test
   echo "No review needed" >> notes.md
   git add notes.md
   git commit -m "Add YOLO note"
   git push -u origin yolo-test
   ```

3. Open a pull request into `main`. Do not request reviewers.
4. Click Merge pull request, then Confirm merge.
5. Wait up to 24 hours.

## Common mistakes

- Branch protection that requires approvals. It blocks you from merging without a review. Use a repository without that rule.
- Getting a review first. The badge is about merging with no review.
- Expecting to earn it twice. It is one-time.

## A note on real projects

Skipping review is fine in your own practice repository. On a team project, reviews catch bugs and share knowledge. Earn this badge where it is harmless, and keep reviewing real work.
