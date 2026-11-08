# Pair Extraordinaire

## The rule

Make co-authored commits in pull requests that get merged.

## Tiers

| Default | Bronze | Silver | Gold |
| --- | --- | --- | --- |
| 1 | 10 | 24 | 48 |

The number counts merged pull requests that contain co-authored commits.

## Difficulty

Medium. You need a real collaborator.

## Steps

1. Find a friend, classmate or teammate with a GitHub account who agrees to be credited.
2. Ask for their GitHub no-reply email address. It looks like `12345678+username@users.noreply.github.com` and can be found in their account's email settings.
3. Create a branch and make a real change together, even a small one.
4. Add the co-author to the commit message. The trailer needs its own paragraph, so use a second `-m`:

   ```bash
   git commit -m "Add quest data" -m "Co-authored-by: Friend Name <12345678+username@users.noreply.github.com>"
   ```

5. Push and open a pull request.
6. Merge the pull request.
7. Wait up to 24 hours.

GitHub's documentation has more detail: [Creating a commit with multiple authors](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors).

## Common mistakes

- Writing the trailer on the same line as the message instead of in its own paragraph.
- Using an email that does not belong to the co-author's account.
- Forgetting to merge the pull request.

## Fair play

Only credit people who actually helped. A second account that you control is not a collaborator. See [11-fair-play.md](11-fair-play.md).
