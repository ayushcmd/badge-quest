window.BADGE_DATA = {
  tierLabels: ["Default", "Bronze", "Silver", "Gold"],

  quests: [
    {
      id: "base-camp",
      icon: "shield",
      title: "Base Camp",
      badge: "Profile setup",
      difficulty: "Start here",
      optional: false,
      oneTime: false,
      tiers: null,
      summary: "Before you chase any badge, learn where badges live and which settings decide what is shown or counted. These five checks prevent most of the \"why is my badge missing\" problems later.",
      criteria: "No badge here. This level sets up your profile so every later badge can be counted and displayed.",
      steps: [
        {
          title: "Find the badge area on your profile",
          body: "Open github.com and go to your own profile page. Earned achievements appear in the left sidebar, below your bio. On any profile you can hover over a badge to see how it was earned."
        },
        {
          title: "Check that achievements are switched on",
          body: "Click your profile picture, then Settings. Under Profile settings, make sure the option to show achievements on your profile is selected, then click Update preferences."
        },
        {
          title: "Know the private contributions switch",
          body: "On your profile, click Contribution settings above the contribution calendar. The Private contributions option controls whether anonymized private activity is included. Public work counts by default."
        },
        {
          title: "Learn how to hide a single badge",
          body: "Click a badge in your profile sidebar and use the eye icon. A hidden badge is visible only to you, so you can always change your mind."
        },
        {
          title: "Verify your Git email",
          body: "Commits are matched to your account by email. Check which address Git uses, then confirm the same address is listed and verified under Settings, then Emails.",
          code: "git config user.email"
        }
      ],
      pitfalls: [
        "Commits made with an unverified email may not be linked to your account.",
        "Private repository activity does not count unless private contributions are turned on.",
        "A new badge can take up to 24 hours to appear."
      ],
      quiz: [
        {
          q: "Where do achievement badges appear?",
          options: ["In the sidebar of your profile", "On the Actions tab of a repository", "In the Pages settings", "At the top of every pull request"],
          answer: 0,
          why: "Badges sit in the profile sidebar under your bio."
        },
        {
          q: "How long can a new badge take to show up?",
          options: ["Exactly 5 minutes", "Up to 24 hours", "Up to 30 days", "It always appears instantly"],
          answer: 1,
          why: "GitHub can take up to 24 hours, so wait a full day before troubleshooting."
        },
        {
          q: "You merged a pull request only inside your own fork. Does that trigger a badge?",
          options: ["Yes, always", "Yes, but only for Pull Shark", "No, work only in a fork does not count", "Only if the fork is private"],
          answer: 2,
          why: "Work that exists only in a fork does not count. A pull request has to be merged into the parent repository."
        }
      ],
      links: [
        { label: "GitHub Docs: manage visibility settings", url: "https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/manage-visibility-settings-for-private-contributions-and-achievements" }
      ]
    },

    {
      id: "quickdraw",
      icon: "bolt",
      title: "Quick Draw Lane",
      badge: "Quickdraw",
      difficulty: "Very easy",
      optional: false,
      oneTime: true,
      tiers: null,
      summary: "Open an issue or pull request and close it within five minutes. It is a one-time badge, so you only ever need to do it once.",
      criteria: "Close an issue or a pull request within 5 minutes of opening it.",
      steps: [
        {
          title: "Create a public practice repository",
          body: "Click New repository, name it something like badge-practice, make it public and tick Add a README file. You will reuse this repository for the next levels."
        },
        {
          title: "Open an issue",
          body: "Open the Issues tab, click New issue, type a title such as Quickdraw test, and click Submit new issue."
        },
        {
          title: "Close it before the timer ends",
          body: "Start a five minute timer the moment you submit. Click Close issue straight away. Closing takes seconds, so there is no reason to wait."
        },
        {
          title: "Wait and check your profile",
          body: "Give GitHub up to 24 hours, then look at your profile sidebar. This badge has no tiers and will not appear a second time."
        }
      ],
      pitfalls: [
        "Waiting longer than five minutes before closing.",
        "Doing it only inside a fork. Use a repository you own.",
        "Opening and instantly closing issues in other people's projects. That notifies maintainers for no reason."
      ],
      quiz: [
        {
          q: "What is the time limit for Quickdraw?",
          options: ["1 minute", "5 minutes", "1 hour", "24 hours"],
          answer: 1,
          why: "You must close the issue or pull request within 5 minutes of opening it."
        },
        {
          q: "Does Quickdraw have Bronze, Silver and Gold tiers?",
          options: ["Yes, four tiers", "Yes, but only Bronze", "No, it is a one-time badge", "Only for pull requests"],
          answer: 2,
          why: "Quickdraw is awarded once and has no tiers."
        },
        {
          q: "Which of these earns the badge?",
          options: ["Closing an issue you opened 20 minutes ago", "Closing an issue 2 minutes after opening it", "Leaving an issue open for a day", "Starring a repository"],
          answer: 1,
          why: "Only closing within 5 minutes of opening counts."
        }
      ],
      links: []
    },

    {
      id: "pull-shark",
      icon: "fin",
      title: "Pull Shark Pier",
      badge: "Pull Shark",
      difficulty: "Easy to start",
      optional: false,
      oneTime: false,
      tiers: [2, 16, 128, 1024],
      summary: "Get pull requests merged. Two merged pull requests unlock the first tier, and real contributions carry you the rest of the way.",
      criteria: "Open pull requests that get merged. The count is your merged pull requests.",
      steps: [
        {
          title: "Use a public repository you own",
          body: "Your practice repository from the last level is perfect. It needs a README on the main branch."
        },
        {
          title: "Create a branch",
          body: "Work on a branch instead of main, the same way you would on a real project.",
          code: "git checkout -b practice-1"
        },
        {
          title: "Change a file, commit and push",
          body: "Make a small change, commit it and push the branch to GitHub.",
          code: "echo \"Practice note 1\" >> notes.md\ngit add notes.md\ngit commit -m \"Add practice note 1\"\ngit push -u origin practice-1"
        },
        {
          title: "Open the pull request",
          body: "On GitHub, click Compare and pull request. Check that the base branch is main, then click Create pull request."
        },
        {
          title: "Merge it, then repeat once",
          body: "Click Merge pull request, then Confirm merge. Repeat with a second branch such as practice-2. Two merged pull requests give you the first tier."
        },
        {
          title: "Plan your real contributions",
          body: "For the higher tiers, fix typos in docs, improve a README, add a missing test or pick a good first issue in a tool you use. Small genuine pull requests add up, and maintainers welcome them."
        }
      ],
      pitfalls: [
        "An open pull request is not a merged one. It has to be merged.",
        "Commits with an unverified email may not be linked to you.",
        "Work only in a fork does not count until a pull request is merged into the parent repository.",
        "Flooding other projects with pointless pull requests wastes maintainers' time."
      ],
      quiz: [
        {
          q: "How many merged pull requests unlock the first tier of Pull Shark?",
          options: ["1", "2", "16", "128"],
          answer: 1,
          why: "The first tier needs 2 merged pull requests."
        },
        {
          q: "What does Pull Shark count?",
          options: ["Pull requests you opened that were merged", "Pull requests you reviewed", "Pull requests you commented on", "Pull requests you starred"],
          answer: 0,
          why: "It counts your own pull requests that got merged."
        },
        {
          q: "You have 20 merged pull requests. Which tier have you reached?",
          options: ["Default", "Bronze", "Silver", "Gold"],
          answer: 1,
          why: "Bronze starts at 16 and Silver starts at 128, so 20 is Bronze."
        }
      ],
      links: [
        { label: "GitHub Docs: creating a pull request", url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request" }
      ]
    },

    {
      id: "yolo",
      icon: "flag",
      title: "YOLO Yard",
      badge: "YOLO",
      difficulty: "Very easy",
      optional: false,
      oneTime: true,
      tiers: null,
      summary: "Merge a pull request without any code review. Do it once, in your own practice repository, where it is harmless.",
      criteria: "Merge a pull request without code review.",
      steps: [
        {
          title: "Choose a repository with no required reviews",
          body: "Use a repository you own where no rule demands approvals before merging. Your practice repository is fine."
        },
        {
          title: "Branch, commit and push",
          body: "Make a tiny change on a new branch and push it.",
          code: "git checkout -b yolo-test\necho \"No review needed\" >> notes.md\ngit add notes.md\ngit commit -m \"Add YOLO note\"\ngit push -u origin yolo-test"
        },
        {
          title: "Open the pull request without reviewers",
          body: "Create the pull request into main. Do not request a reviewer and do not wait for approval."
        },
        {
          title: "Merge it directly",
          body: "Click Merge pull request, then Confirm merge. Then wait up to 24 hours for the badge."
        }
      ],
      pitfalls: [
        "Branch protection that requires approvals will block the merge. Use a repository without that rule.",
        "If the pull request gets a review first, it no longer counts as merged without review.",
        "It is a one-time badge, so repeating it earns nothing more.",
        "On real team projects, reviews matter. Keep this trick for your own practice repository."
      ],
      quiz: [
        {
          q: "What earns the YOLO badge?",
          options: ["Merging a pull request without code review", "Closing an issue quickly", "Getting 16 stars", "Sponsoring someone"],
          answer: 0,
          why: "YOLO is for merging a pull request without code review."
        },
        {
          q: "Where is it sensible to earn it?",
          options: ["On a production team project", "In your own practice repository", "In a stranger's repository", "In GitHub's Community forum"],
          answer: 1,
          why: "Skipping review is harmless in your own practice repository, and risky on shared work."
        },
        {
          q: "Why might your merge be blocked?",
          options: ["Your repository has no README", "Branch protection requires approvals", "You used too few words in the title", "The pull request is too small"],
          answer: 1,
          why: "A rule that requires approvals stops you from merging without a review."
        }
      ],
      links: []
    },

    {
      id: "pair-extraordinaire",
      icon: "pair",
      title: "Pair Programming Park",
      badge: "Pair Extraordinaire",
      difficulty: "Medium",
      optional: false,
      oneTime: false,
      tiers: [1, 10, 24, 48],
      summary: "Credit a real collaborator on a commit, then get that pull request merged. This one needs a second person who agrees to be credited.",
      criteria: "Make co-authored commits in pull requests that get merged. The count is merged pull requests that contain co-authored commits.",
      steps: [
        {
          title: "Find a real collaborator",
          body: "Ask a friend, classmate or teammate with a GitHub account who is happy to be credited. Do not use a second account of your own."
        },
        {
          title: "Get their no-reply email",
          body: "Ask for their GitHub no-reply email address. It looks like 12345678+username@users.noreply.github.com and appears in their account email settings."
        },
        {
          title: "Work on a branch together",
          body: "Make a real change together, even a small one, on a new branch."
        },
        {
          title: "Credit them in the commit",
          body: "Add a Co-authored-by line in its own paragraph. Using a second message flag does this for you.",
          code: "git commit -m \"Add quest data\" -m \"Co-authored-by: Friend Name <12345678+username@users.noreply.github.com>\""
        },
        {
          title: "Push, open and merge the pull request",
          body: "Push the branch, open a pull request into main and merge it. Then wait up to 24 hours."
        }
      ],
      pitfalls: [
        "Writing the trailer on the same line as the commit message instead of its own paragraph.",
        "Using an email address that does not belong to the co-author's account.",
        "Forgetting to merge the pull request.",
        "Crediting someone who did not help. Only credit real collaborators."
      ],
      quiz: [
        {
          q: "Which line credits a co-author in a commit message?",
          options: ["Pair-with: Name", "Co-authored-by: Name <email>", "Helper: Name", "Reviewed-by: Name"],
          answer: 1,
          why: "The trailer is Co-authored-by followed by the name and email."
        },
        {
          q: "Does the pull request have to be merged?",
          options: ["No, opening is enough", "Yes, it has to be merged", "Only for Gold", "Only if it has a review"],
          answer: 1,
          why: "The badge counts merged pull requests that contain co-authored commits."
        },
        {
          q: "Who should you list as a co-author?",
          options: ["Anyone with many followers", "A second account you created", "A person who really worked on the change and agreed", "Nobody, the badge is automatic"],
          answer: 2,
          why: "Credit real collaborators with their agreement."
        }
      ],
      links: [
        { label: "GitHub Docs: commits with multiple authors", url: "https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors" }
      ]
    },

    {
      id: "starstruck",
      icon: "star",
      title: "Starstruck Summit",
      badge: "Starstruck",
      difficulty: "Hard",
      optional: false,
      oneTime: false,
      tiers: [16, 128, 512, 4096],
      summary: "Build something other people find useful and let them star it. No shortcut here, which is why this level is about making a project worth starring.",
      criteria: "A single repository you created receives stars. Stars are counted per repository, not across your whole profile.",
      steps: [
        {
          title: "Pick a real problem",
          body: "Choose something you or your classmates actually need: a tool, a template, a cheat sheet or a learning resource."
        },
        {
          title: "Write a README that explains fast",
          body: "Say what it is, why it exists and how to run it. Add a screenshot if the project has a screen."
        },
        {
          title: "Add description, topics and a license",
          body: "On the repository page, click the gear next to About to add a description and topics. Add a license file so people know they can use it."
        },
        {
          title: "Share it where the audience already is",
          body: "Post it in communities, class groups or your own writing. Follow each community's rules about self-promotion."
        },
        {
          title: "Keep it alive",
          body: "Answer issues, fix bugs and publish updates. Projects that look maintained collect more stars."
        }
      ],
      pitfalls: [
        "A missing README. Visitors cannot tell what the project does.",
        "Begging for stars in spam messages.",
        "Buying or botting stars. Automated or purchased stars count as rank abuse under GitHub's rules.",
        "Adding up stars across many repositories. The badge looks at one."
      ],
      quiz: [
        {
          q: "How many stars unlock the first tier of Starstruck?",
          options: ["4", "16", "128", "4096"],
          answer: 1,
          why: "The first tier starts at 16 stars on one repository."
        },
        {
          q: "How many stars does the Gold tier need?",
          options: ["512", "1024", "4096", "10000"],
          answer: 2,
          why: "Gold is 4096 stars."
        },
        {
          q: "What is the honest way to earn stars?",
          options: ["Buy them", "Make a useful project with a clear README", "Create bot accounts", "Star your own repositories repeatedly"],
          answer: 1,
          why: "A useful project that explains itself well is what earns real stars."
        }
      ],
      links: []
    },

    {
      id: "galaxy-brain",
      icon: "orbit",
      title: "Galaxy Brain Observatory",
      badge: "Galaxy Brain",
      difficulty: "Medium to hard",
      optional: false,
      oneTime: false,
      tiers: [2, 8, 16, 32],
      summary: "Answer questions in GitHub Discussions until someone marks your reply as the answer. Note that GitHub's own Community forum no longer counts, but other projects' Discussions still do.",
      criteria: "Have your replies accepted as answers in GitHub Discussions. The count is replies marked as the answer.",
      steps: [
        {
          title: "Find projects with Discussions",
          body: "Open the Discussions tab of tools you already use. Look for a Question and Answer category."
        },
        {
          title: "Pick questions you really can answer",
          body: "Read the whole question. If it involves code, try to reproduce the problem before you reply."
        },
        {
          title: "Write a helpful reply",
          body: "Explain why it happens, show the fix and link the relevant documentation. Be kind and clear."
        },
        {
          title: "Wait for it to be accepted",
          body: "The person who asked, or a maintainer, has to mark your reply as the answer. You cannot accept your own."
        },
        {
          title: "Repeat until you have two accepted answers",
          body: "Two accepted answers unlock the first tier. Then wait up to 24 hours for the badge."
        }
      ],
      pitfalls: [
        "Low-effort replies rarely get accepted.",
        "Looking only in GitHub's own Community forum, which no longer awards this badge.",
        "Posting guesses across many threads to farm answers. That is spam, and it is why the badge was restricted."
      ],
      quiz: [
        {
          q: "What counts toward Galaxy Brain?",
          options: ["Replies marked as the answer in Discussions", "Questions you ask", "Reactions you give", "Stars on your answers"],
          answer: 0,
          why: "Only replies marked as the answer count."
        },
        {
          q: "How many accepted answers unlock the first tier?",
          options: ["1", "2", "8", "32"],
          answer: 1,
          why: "The first tier needs 2 accepted answers."
        },
        {
          q: "Do answers in GitHub's own Community forum still count?",
          options: ["Yes, all of them", "No, other projects' Discussions are the route", "Only on weekends", "Only for Gold"],
          answer: 1,
          why: "GitHub stopped awarding the badge in its own Community forum. Other repositories' Discussions still count."
        }
      ],
      links: [
        { label: "GitHub Docs: About Discussions", url: "https://docs.github.com/en/discussions/collaborating-with-your-community-using-discussions/about-discussions" }
      ]
    },

    {
      id: "public-sponsor",
      icon: "heart",
      title: "Sponsor Corner",
      badge: "Public Sponsor",
      difficulty: "Optional, costs money",
      optional: true,
      oneTime: true,
      tiers: null,
      summary: "Sponsor a maintainer through GitHub Sponsors and keep it public. This level is optional because it costs real money, and you never have to pay for a badge.",
      criteria: "Sponsor a contributor or project through GitHub Sponsors. It was previously called GitHub Sponsor.",
      steps: [
        {
          title: "Decide if you want to",
          body: "This is completely optional. Skip it if money is tight. You can still finish the rest of the game."
        },
        {
          title: "Browse who to support",
          body: "Open github.com/sponsors/explore and look for tools you rely on every day."
        },
        {
          title: "Choose a tier and pay",
          body: "Some maintainers offer one-time options and others offer monthly ones. Remember that monthly means recurring."
        },
        {
          title: "Make the sponsorship public",
          body: "When asked, choose to show your sponsorship publicly. A private sponsorship does not show on your profile."
        }
      ],
      pitfalls: [
        "Sponsoring privately and then wondering why no badge appears.",
        "Forgetting that a monthly sponsorship keeps charging.",
        "Treating it as a shortcut. Sponsor because you want to support the maintainer."
      ],
      quiz: [
        {
          q: "Does Public Sponsor cost money?",
          options: ["No, it is free", "Yes, you sponsor someone with real money", "Only on Fridays", "Only for students"],
          answer: 1,
          why: "Sponsoring through GitHub Sponsors is a payment, which is why this level is optional."
        },
        {
          q: "What must be true for the badge to show?",
          options: ["The sponsorship is public", "The sponsorship is private", "You sponsor three people", "You sponsor your own account"],
          answer: 0,
          why: "A private sponsorship does not appear on your profile."
        },
        {
          q: "Does Public Sponsor have tiers?",
          options: ["Yes, four", "Yes, two", "No, it is one-time", "Only Gold"],
          answer: 2,
          why: "Public Sponsor is a one-time badge."
        }
      ],
      links: [
        { label: "Explore GitHub Sponsors", url: "https://github.com/sponsors/explore" }
      ]
    },

    {
      id: "missing-badge",
      icon: "search",
      title: "Boss Level: The Missing Badge",
      badge: "Troubleshooting",
      difficulty: "Debugging",
      optional: false,
      oneTime: false,
      tiers: null,
      summary: "You did everything right and the badge is still missing. Work through the checklist like a detective and pass the scenario quiz to finish the game.",
      criteria: "No badge here. This level teaches the checks that explain nearly every missing badge.",
      steps: [
        {
          title: "Wait a full day and check in a private window",
          body: "Badges can take up to 24 hours. Open your profile in a private or incognito window to rule out cache problems."
        },
        {
          title: "Check private contributions",
          body: "If the work was in a private repository, turn on Private contributions in Contribution settings. Details stay anonymized."
        },
        {
          title: "Check for fork-only work",
          body: "Pull requests and issues that exist only in a fork do not count. Open a pull request that gets merged into the parent repository."
        },
        {
          title: "Verify your email",
          body: "The email Git uses must be listed and verified in your account email settings.",
          code: "git config user.email"
        },
        {
          title: "Check the branch",
          body: "Commits on a non-default branch count only after they are merged into the default branch, usually main or master."
        },
        {
          title: "Remember one-time badges",
          body: "Quickdraw, YOLO and Public Sponsor are awarded once. If you already have one, it will not appear again."
        },
        {
          title: "Contact GitHub Support",
          body: "If every check passes and 24 hours have gone by, contact GitHub Support and explain what you did."
        }
      ],
      pitfalls: [
        "Changing many things at once. Check one cause at a time.",
        "Trusting old tutorials. Criteria can change, as with Galaxy Brain in GitHub's Community forum."
      ],
      quiz: [
        {
          q: "Your pull request merged into the default branch of your fork only. Where is the likely problem?",
          options: ["Fork-only work does not count", "Your username is too long", "The README is missing", "You need more followers"],
          answer: 0,
          why: "Work that exists only in a fork does not trigger badges."
        },
        {
          q: "Your commits use an email that is not on your account. What should you do?",
          options: ["Delete the repository", "Add and verify that email in settings", "Wait a year", "Switch to a private repository"],
          answer: 1,
          why: "Commits tied to an unverified email are not recognized."
        },
        {
          q: "You finished a task 2 hours ago and see no badge. What is the first move?",
          options: ["Contact support immediately", "Wait up to 24 hours", "Delete and redo the work", "Create a new account"],
          answer: 1,
          why: "Badges can take up to 24 hours to appear."
        },
        {
          q: "Your work sits on a feature branch that was never merged. What is missing?",
          options: ["A merge into the default branch", "A new license", "More stars", "A second reviewer"],
          answer: 0,
          why: "Work on non-default branches counts after it is merged into the default branch."
        }
      ],
      links: [
        { label: "GitHub Support", url: "https://support.github.com/" }
      ]
    }
  ],

  archive: {
    retired: [
      {
        name: "Arctic Code Vault Contributor",
        text: "Code included in the 2020 GitHub Archive Program snapshot. It cannot be earned any more."
      },
      {
        name: "Mars 2020 Contributor",
        text: "Code contributed to repositories used by the Mars 2020 helicopter mission. It was previously named Mars 2020 Helicopter Contributor and cannot be earned any more."
      }
    ],
    unreleased: [
      {
        name: "Heart On Your Sleeve",
        text: "Appears in badge asset lists, but GitHub has not published criteria. Guesses online are unverified."
      },
      {
        name: "Open Sourcerer",
        text: "Appears in badge asset lists, but GitHub has not published criteria. Guesses online are unverified."
      }
    ],
    highlights: [
      { name: "GitHub Pro", text: "Shows an active Pro subscription." },
      { name: "Developer Program Member", text: "Shows membership in GitHub's developer program." },
      { name: "Security Bug Bounty Hunter", text: "Credit for reporting vulnerabilities." },
      { name: "GitHub Campus Expert", text: "Recognition for student leaders." },
      { name: "Security Advisory Credit", text: "Contributions to the GitHub Advisory Database." }
    ]
  }
};
