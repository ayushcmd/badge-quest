(function () {
  "use strict";

  const data = window.BADGE_DATA;
  const quests = data.quests;
  const tierLabels = data.tierLabels;
  const STORE_KEY = "badgeQuest.v1";
  const XP_STEP = 10;
  const XP_QUIZ = 50;
  const app = document.getElementById("app");
  const xpChip = document.getElementById("xpChip");
  const drafts = {};
  const results = {};

  const ICONS = {
    shield: '<path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5l8-3z"/>',
    bolt: '<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>',
    fin: '<path d="M3 20c4 0 7-2 8-6 1-4 0-8-3-12 7 2 12 8 12 14 0 2-1 4-3 4H3z"/>',
    flag: '<path d="M5 2h2v20H5V2zm3 1h11l-2.5 4.5L19 12H8V3z"/>',
    pair: '<circle cx="9" cy="10" r="6"/><circle cx="15" cy="14" r="6" opacity="0.65"/>',
    star: '<path d="M12 2l3 6.5 7 .9-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.9L12 2z"/>',
    orbit: '<circle cx="12" cy="12" r="3.4"/><ellipse cx="12" cy="12" rx="10" ry="4.4" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(-28 12 12)"/>',
    heart: '<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z"/>',
    search: '<circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M15 15l6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    lock: '<path fill-rule="evenodd" d="M7 10V8a5 5 0 0110 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H6a1 1 0 01-1-1v-9a1 1 0 011-1h1zm2 0h6V8a3 3 0 00-6 0v2z"/>'
  };

  const PLANNER_UNITS = {
    "pull-shark": "merged pull requests",
    "pair-extraordinaire": "merged pull requests with co-authored commits",
    starstruck: "stars on your best repository",
    "galaxy-brain": "accepted answers"
  };

  function defaultState() {
    return { name: "", steps: {}, quiz: {}, unlockAll: false };
  }

  function loadState() {
    const fresh = defaultState();
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) {
        return fresh;
      }
      const parsed = JSON.parse(raw);
      return {
        name: typeof parsed.name === "string" ? parsed.name : "",
        steps: parsed.steps && typeof parsed.steps === "object" ? parsed.steps : {},
        quiz: parsed.quiz && typeof parsed.quiz === "object" ? parsed.quiz : {},
        unlockAll: parsed.unlockAll === true
      };
    } catch (error) {
      return fresh;
    }
  }

  let state = loadState();

  function saveState() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (error) {
      return;
    }
  }

  function esc(value) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value).replace(/[&<>"']/g, function (char) {
      return map[char];
    });
  }

  function icon(name, size) {
    const px = size || 24;
    return '<svg class="icon" viewBox="0 0 24 24" width="' + px + '" height="' + px + '" fill="currentColor" aria-hidden="true" focusable="false">' + ICONS[name] + "</svg>";
  }

  function findQuest(id) {
    return quests.find(function (quest) {
      return quest.id === id;
    });
  }

  function questIndex(quest) {
    return quests.indexOf(quest);
  }

  function stepDone(quest, index) {
    const list = state.steps[quest.id];
    return Array.isArray(list) && list[index] === true;
  }

  function stepsDone(quest) {
    return quest.steps.filter(function (step, index) {
      return stepDone(quest, index);
    }).length;
  }

  function quizPassed(quest) {
    return state.quiz[quest.id] === true;
  }

  function questDone(quest) {
    return stepsDone(quest) === quest.steps.length && quizPassed(quest);
  }

  function questXp(quest) {
    return stepsDone(quest) * XP_STEP + (quizPassed(quest) ? XP_QUIZ : 0);
  }

  function maxXp() {
    return quests.reduce(function (sum, quest) {
      return sum + quest.steps.length * XP_STEP + XP_QUIZ;
    }, 0);
  }

  function totalXp() {
    return quests.reduce(function (sum, quest) {
      return sum + questXp(quest);
    }, 0);
  }

  function doneCount() {
    return quests.filter(questDone).length;
  }

  function rankName() {
    const ratio = totalXp() / maxXp();
    if (ratio >= 1) {
      return "Badge Master";
    }
    if (ratio >= 0.85) {
      return "Architect";
    }
    if (ratio >= 0.6) {
      return "Maintainer";
    }
    if (ratio >= 0.35) {
      return "Reviewer";
    }
    if (ratio >= 0.15) {
      return "Committer";
    }
    return "Rookie";
  }

  function blockingQuest(index) {
    for (let i = 0; i < index; i += 1) {
      if (!quests[i].optional && !questDone(quests[i])) {
        return quests[i];
      }
    }
    return null;
  }

  function isUnlocked(index) {
    return state.unlockAll || blockingQuest(index) === null;
  }

  function nextQuest() {
    for (let i = 0; i < quests.length; i += 1) {
      if (isUnlocked(i) && !questDone(quests[i])) {
        return quests[i];
      }
    }
    return null;
  }

  function tierText(quest) {
    if (quest.tiers) {
      return "Tiers: " + quest.tiers.join(" / ");
    }
    if (quest.oneTime) {
      return "One-time badge";
    }
    return "Skill level";
  }

  function percentOf(a, b) {
    return b === 0 ? 0 : Math.round((a / b) * 100);
  }

  function progressBar(value, max, label, rightLabel) {
    const percent = percentOf(value, max);
    return (
      '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '" aria-label="' + esc(label) + '">' +
      '<div class="progress-fill" style="width:' + percent + '%"></div></div>' +
      '<div class="progress-label"><span>' + esc(label) + "</span><span>" + esc(rightLabel) + "</span></div>"
    );
  }

  function tierReached(tiers, count) {
    let reached = -1;
    tiers.forEach(function (threshold, index) {
      if (count >= threshold) {
        reached = index;
      }
    });
    return reached;
  }

  function tierLadder(tiers, count) {
    const hasCount = typeof count === "number";
    const reached = hasCount ? tierReached(tiers, count) : -1;
    return (
      '<div class="tier-ladder">' +
      tiers
        .map(function (threshold, index) {
          const classes = ["tier", "is-" + tierLabels[index].toLowerCase()];
          if (index <= reached) {
            classes.push("is-reached");
          } else if (hasCount && index === reached + 1) {
            classes.push("is-next");
          }
          return '<div class="' + classes.join(" ") + '"><span class="tier-name">' + tierLabels[index] + '</span><span class="tier-count">' + threshold + "</span></div>";
        })
        .join("") +
      "</div>"
    );
  }

  function medal(name, locked, big) {
    const classes = ["medal"];
    if (locked) {
      classes.push("is-locked");
    }
    if (big) {
      classes.push("is-big");
    }
    return '<span class="' + classes.join(" ") + '">' + icon(locked ? "lock" : name) + "</span>";
  }

  function questCard(quest, index) {
    const unlocked = isUnlocked(index);
    const done = questDone(quest);
    const blocker = blockingQuest(index);
    const status = done
      ? '<span class="pill is-done">Complete</span>'
      : unlocked
        ? '<span class="pill is-open">Open</span>'
        : '<span class="pill is-locked">Locked</span>';
    const pills =
      '<div class="pills"><span class="pill">' + esc(quest.difficulty) + '</span><span class="pill">' + esc(tierText(quest)) + "</span>" +
      (quest.optional ? '<span class="pill">Optional</span>' : "") +
      "</div>";
    const progress = unlocked
      ? "<p>" + stepsDone(quest) + " of " + quest.steps.length + " steps ticked" + (quizPassed(quest) ? ", quiz passed" : "") + ".</p>"
      : "<p>Finish Level " + (questIndex(blocker) + 1) + " first.</p>";
    const inner =
      '<div class="quest-top"><span class="level-tag">Level ' + (index + 1) + "</span>" + status + "</div>" +
      '<div class="quest-top">' + medal(quest.icon, !unlocked, false) + "</div>" +
      "<h3>" + esc(quest.title) + "</h3>" +
      pills +
      progress;
    if (unlocked) {
      return '<a class="quest-card clay' + (done ? " is-done" : "") + '" href="#/quest/' + quest.id + '">' + inner + "</a>";
    }
    return '<div class="quest-card clay is-locked">' + inner + "</div>";
  }

  function renderHome() {
    const next = nextQuest();
    const started = totalXp() > 0;
    const cta = next
      ? '<a class="btn btn-primary" href="#/quest/' + next.id + '">' + (started ? "Continue: " : "Start: ") + esc(next.title) + "</a>"
      : '<a class="btn btn-primary" href="#/shelf">See your shelf</a>';
    const html =
      '<section class="hero clay">' +
      "<div>" +
      '<span class="eyebrow">GitHub Achievements, as a game</span>' +
      "<h1>Learn GitHub badges by playing.</h1>" +
      '<p class="lead">Nine short levels. Real steps on real GitHub. Pass each quiz to put a clay medal on your shelf.</p>' +
      '<div class="hero-actions">' + cta + '<a class="btn" href="#/planner">Tier Planner</a></div>' +
      "</div>" +
      '<div class="mascot" aria-hidden="true">' +
      '<div class="mascot-ribbon left"></div><div class="mascot-ribbon right"></div>' +
      '<div class="mascot-body"><div class="mascot-star"></div><div class="mascot-eye left"></div><div class="mascot-eye right"></div><div class="mascot-mouth"></div></div>' +
      "</div>" +
      "</section>" +
      '<section class="card clay" aria-label="Your progress">' +
      progressBar(totalXp(), maxXp(), doneCount() + " of " + quests.length + " levels complete", totalXp() + " of " + maxXp() + " XP") +
      "</section>" +
      '<div class="section-title"><h2>How it works</h2></div>' +
      '<div class="steps-3">' +
      '<div class="mini clay"><span class="num">1</span><h3>Read the briefing</h3><p>Each level explains one badge in plain words: the rule, the tiers and the traps.</p></div>' +
      '<div class="mini clay"><span class="num">2</span><h3>Do the steps</h3><p>Follow the steps on GitHub and tick each one when you have done it.</p></div>' +
      '<div class="mini clay"><span class="num">3</span><h3>Pass the quiz</h3><p>Answer every question correctly to finish the level and earn the medal.</p></div>' +
      "</div>" +
      '<div class="section-title"><h2>Quest map</h2><p>Levels open one after another. Sponsor Corner is optional.</p></div>' +
      '<div class="grid">' +
      quests.map(questCard).join("") +
      "</div>";
    return { title: "Learn GitHub badges by playing", html: html };
  }

  function renderStep(quest, step, index) {
    const done = stepDone(quest, index);
    const code = step.code
      ? '<div class="code"><button type="button" class="copy" data-action="copy">Copy</button><pre><code>' + esc(step.code) + "</code></pre></div>"
      : "";
    return (
      '<article class="step clay' + (done ? " is-done" : "") + '">' +
      '<div class="step-num">' + (index + 1) + "</div>" +
      "<div><h3>" + esc(step.title) + "</h3><p>" + esc(step.body) + "</p>" + code + "</div>" +
      '<label class="check"><input type="checkbox" id="step-' + quest.id + "-" + index + '" data-step data-quest="' + quest.id + '" data-index="' + index + '"' + (done ? " checked" : "") + ' aria-label="I did this: ' + esc(step.title) + '"> I did this</label>' +
      "</article>"
    );
  }

  function renderQuiz(quest) {
    const passed = quizPassed(quest);
    const draft = drafts[quest.id] || {};
    const result = results[quest.id];
    const questions = quest.quiz
      .map(function (item, qi) {
        const picked = passed ? item.answer : draft[qi];
        const checked = !passed && result && result.checked[qi] === true;
        const options = item.options
          .map(function (option, oi) {
            const classes = ["option"];
            if (picked === oi) {
              classes.push("is-picked");
            }
            if (passed && oi === item.answer) {
              classes.push("is-correct");
            } else if (checked && picked === oi) {
              classes.push(result.correct[qi] ? "is-correct" : "is-wrong");
            }
            return (
              '<label class="' + classes.join(" ") + '">' +
              '<input type="radio" id="' + quest.id + "-q" + qi + "-o" + oi + '" name="' + quest.id + "-q" + qi + '" value="' + oi + '" data-answer data-quest="' + quest.id + '" data-q="' + qi + '"' + (picked === oi ? " checked" : "") + (passed ? " disabled" : "") + ">" +
              "<span>" + esc(option) + "</span></label>"
            );
          })
          .join("");
        let feedback = "";
        if (passed) {
          feedback = '<p class="feedback ok">' + esc(item.why) + "</p>";
        } else if (checked) {
          if (draft[qi] === undefined) {
            feedback = '<p class="feedback neutral">Pick an answer.</p>';
          } else if (result.correct[qi]) {
            feedback = '<p class="feedback ok">Correct. ' + esc(item.why) + "</p>";
          } else {
            feedback = '<p class="feedback no">Not quite. Re-read the briefing and try again.</p>';
          }
        }
        return '<fieldset class="quiz-q"><legend>' + (qi + 1) + ". " + esc(item.q) + "</legend>" + options + feedback + "</fieldset>";
      })
      .join("");
    let footer;
    if (passed) {
      footer = '<span class="pill is-done">Quiz passed, +' + XP_QUIZ + " XP</span>";
    } else {
      const summary = result
        ? "<p>" + result.correct.filter(Boolean).length + " of " + quest.quiz.length + " correct. Fix the red ones and check again.</p>"
        : "";
      footer = summary + '<button type="button" class="btn btn-primary" id="check-' + quest.id + '" data-action="check-quiz" data-quest="' + quest.id + '">Check my answers</button>';
    }
    return (
      '<section class="card clay" aria-labelledby="quiz-title">' +
      '<h2 id="quiz-title">Quiz</h2>' +
      "<p>Answer every question correctly to finish the level and earn " + XP_QUIZ + " XP.</p>" +
      questions + footer +
      "</section>"
    );
  }

  function renderCompletion(quest, index) {
    if (questDone(quest)) {
      const next = quests[index + 1];
      const nextButton = next && isUnlocked(index + 1) ? '<a class="btn btn-primary" href="#/quest/' + next.id + '">Next: ' + esc(next.title) + "</a>" : "";
      return (
        '<section class="banner clay">' +
        medal(quest.icon, false, false) +
        "<div><h2>Level complete</h2><p>The medal is on your shelf. You have " + totalXp() + " XP.</p></div>" +
        '<div class="btns">' + nextButton + '<a class="btn" href="#/shelf">Open shelf</a></div>' +
        "</section>"
      );
    }
    const missingSteps = quest.steps.length - stepsDone(quest);
    const parts = [];
    if (missingSteps > 0) {
      parts.push(missingSteps + (missingSteps === 1 ? " step left to tick" : " steps left to tick"));
    }
    if (!quizPassed(quest)) {
      parts.push("the quiz still to pass");
    }
    return '<section class="callout clay"><h3>To finish this level</h3><p>You have ' + parts.join(" and ") + ".</p></section>";
  }

  function renderQuest(id) {
    const quest = findQuest(id);
    if (!quest) {
      return renderNotFound();
    }
    const index = questIndex(quest);
    if (!isUnlocked(index)) {
      return renderLocked(quest, index);
    }
    const pills =
      '<div class="pills"><span class="pill">' + esc(quest.difficulty) + '</span><span class="pill">' + esc(tierText(quest)) + "</span>" +
      (quest.optional ? '<span class="pill">Optional</span>' : "") +
      "</div>";
    const links = quest.links.length
      ? '<section class="card clay"><h2>Read more</h2><ul class="links">' +
        quest.links.map(function (link) {
          return '<li><a href="' + esc(link.url) + '" target="_blank" rel="noopener noreferrer">' + esc(link.label) + "</a></li>";
        }).join("") +
        "</ul></section>"
      : "";
    const html =
      '<p class="crumbs"><a href="#/home">Quest map</a> / Level ' + (index + 1) + " of " + quests.length + "</p>" +
      '<header class="quest-hero clay">' + medal(quest.icon, false, true) +
      "<div><h1>" + esc(quest.title) + "</h1><p>" + esc(quest.badge) + "</p>" + pills + "</div></header>" +
      '<section class="card clay"><h2>Briefing</h2><p>' + esc(quest.summary) + "</p><p><strong>The rule:</strong> " + esc(quest.criteria) + "</p>" +
      (quest.tiers ? "<h3>Tier thresholds</h3>" + tierLadder(quest.tiers) : "") +
      "</section>" +
      '<div class="section-title"><h2>Your steps</h2><p>' + stepsDone(quest) + " of " + quest.steps.length + " ticked</p></div>" +
      quest.steps.map(function (step, i) {
        return renderStep(quest, step, i);
      }).join("") +
      '<section class="callout clay"><h3>Watch out</h3><ul>' +
      quest.pitfalls.map(function (item) {
        return "<li>" + esc(item) + "</li>";
      }).join("") +
      "</ul></section>" +
      renderQuiz(quest) +
      renderCompletion(quest, index) +
      links;
    return { title: quest.title, html: html };
  }

  function renderLocked(quest, index) {
    const blocker = blockingQuest(index);
    const html =
      '<p class="crumbs"><a href="#/home">Quest map</a> / Level ' + (index + 1) + "</p>" +
      '<section class="card clay"><div class="quest-top">' + medal(quest.icon, true, true) +
      "<div><h1>Level " + (index + 1) + " is locked</h1>" +
      "<p>Finish <strong>" + esc(blocker.title) + "</strong> first to open " + esc(quest.title) + ".</p>" +
      '<a class="btn btn-primary" href="#/quest/' + blocker.id + '">Go to ' + esc(blocker.title) + "</a>" +
      "</div></div>" +
      '<p style="margin-top:20px">Already know the basics? You can open every level from the <a href="#/shelf">Shelf</a> page.</p></section>';
    return { title: "Locked level", html: html };
  }

  function renderShelf() {
    const greeting = state.name ? "Nice work, " + esc(state.name) + "." : "Your medals and rank live here.";
    const shelf = quests
      .map(function (quest, index) {
        const done = questDone(quest);
        const unlocked = isUnlocked(index);
        const inner = medal(quest.icon, !done, false) + "<strong>" + esc(quest.badge) + "</strong><span>" + (done ? "Earned" : "Not earned yet") + "</span>";
        if (unlocked) {
          return '<a class="shelf-item clay' + (done ? "" : " is-locked") + '" href="#/quest/' + quest.id + '" style="text-decoration:none;color:inherit">' + inner + "</a>";
        }
        return '<div class="shelf-item clay is-locked">' + inner + "</div>";
      })
      .join("");
    const html =
      '<section class="rank-card clay">' +
      medal("star", false, true) +
      '<div class="rank-info"><p class="eyebrow">Current rank</p><p class="rank-name">' + rankName() + "</p><p>" + greeting + "</p>" +
      progressBar(totalXp(), maxXp(), totalXp() + " XP", "of " + maxXp() + " XP") +
      "</div></section>" +
      '<div class="section-title"><h2>Medals</h2><p>' + doneCount() + " of " + quests.length + " earned</p></div>" +
      '<div class="shelf-grid">' + shelf + "</div>" +
      '<section class="card clay"><h2>Settings</h2>' +
      '<div class="form-row"><div class="field"><label for="playerName">Your name (optional)</label>' +
      '<input type="text" id="playerName" maxlength="30" autocomplete="nickname" value="' + esc(state.name) + '"></div></div>' +
      '<div class="form-row"><label class="check"><input type="checkbox" id="unlockAll"' + (state.unlockAll ? " checked" : "") + "> Open all levels</label></div>" +
      "<p>Progress is saved only in this browser. Clearing site data removes it.</p>" +
      '<button type="button" class="btn btn-danger btn-small" data-action="reset" id="resetProgress">Reset all progress</button>' +
      "</section>";
    return { title: "Shelf", html: html };
  }

  function plannerQuests() {
    return quests.filter(function (quest) {
      return Array.isArray(quest.tiers);
    });
  }

  function renderPlanner() {
    const options = plannerQuests()
      .map(function (quest) {
        return '<option value="' + quest.id + '">' + esc(quest.badge) + "</option>";
      })
      .join("");
    const html =
      '<div class="section-title"><h1>Tier Planner</h1></div>' +
      '<section class="card clay"><p>Pick a badge, type your current count and see which tier you have reached and what is left.</p>' +
      '<div class="form-row">' +
      '<div class="field"><label for="plannerBadge">Badge</label><select id="plannerBadge">' + options + "</select></div>" +
      '<div class="field"><label for="plannerCount" id="plannerCountLabel">Your count</label><input type="number" id="plannerCount" min="0" step="1" value="0" inputmode="numeric"></div>' +
      "</div>" +
      '<div class="planner-result clay" id="plannerResult" aria-live="polite"></div>' +
      "</section>";
    return { title: "Tier Planner", html: html, mount: updatePlanner };
  }

  function updatePlanner() {
    const select = document.getElementById("plannerBadge");
    const input = document.getElementById("plannerCount");
    const output = document.getElementById("plannerResult");
    const label = document.getElementById("plannerCountLabel");
    if (!select || !input || !output) {
      return;
    }
    const quest = findQuest(select.value);
    const parsed = Number.parseInt(input.value, 10);
    const count = Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
    const unit = PLANNER_UNITS[quest.id];
    const reached = tierReached(quest.tiers, count);
    const current = reached >= 0 ? tierLabels[reached] : "No tier yet";
    let next;
    if (reached === quest.tiers.length - 1) {
      next = "You have reached the top tier. Nothing left to climb.";
    } else {
      const target = quest.tiers[reached + 1];
      next = "Next: " + tierLabels[reached + 1] + " at " + target + ". " + (target - count) + " more to go.";
    }
    label.textContent = "Your count (" + unit + ")";
    output.innerHTML = "<h3>Current tier: " + esc(current) + "</h3><p>" + esc(next) + "</p>" + tierLadder(quest.tiers, count);
  }

  function archiveList(items) {
    return (
      '<div class="archive-list">' +
      items
        .map(function (item) {
          return '<article class="archive-item clay"><h3>' + esc(item.name) + "</h3><p>" + esc(item.text) + "</p></article>";
        })
        .join("") +
      "</div>"
    );
  }

  function renderArchive() {
    const archive = data.archive;
    const html =
      '<div class="section-title"><h1>Archive</h1></div>' +
      '<section class="card clay"><p>Not every item in a profile sidebar is a badge you can earn. This page sorts the rest.</p></section>' +
      "<h2>Retired badges</h2>" + archiveList(archive.retired) +
      "<h2>Listed but unreleased</h2>" + archiveList(archive.unreleased) +
      "<h2>Profile highlights</h2><p>These show status or program membership. They are not achievements.</p>" + archiveList(archive.highlights);
    return { title: "Archive", html: html };
  }

  function renderNotFound() {
    return {
      title: "Page not found",
      html: '<section class="card clay"><h1>Page not found</h1><p>That page does not exist.</p><a class="btn btn-primary" href="#/home">Back to the map</a></section>'
    };
  }

  function updateChrome(view) {
    xpChip.textContent = totalXp() + " XP | " + rankName();
    const active = view === "quest" ? "home" : view;
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function render(isNavigation) {
    const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const view = parts[0] || "home";
    let page;
    if (view === "home") {
      page = renderHome();
    } else if (view === "quest") {
      page = renderQuest(parts[1]);
    } else if (view === "shelf") {
      page = renderShelf();
    } else if (view === "planner") {
      page = renderPlanner();
    } else if (view === "archive") {
      page = renderArchive();
    } else {
      page = renderNotFound();
    }
    app.innerHTML = page.html;
    document.title = page.title + " | Badge Quest";
    updateChrome(view);
    if (page.mount) {
      page.mount();
    }
    if (isNavigation) {
      window.scrollTo(0, 0);
      app.focus({ preventScroll: true });
    }
  }

  function rerender() {
    const y = window.scrollY;
    const active = document.activeElement;
    const activeId = active && app.contains(active) ? active.id : "";
    render(false);
    window.scrollTo(0, y);
    if (activeId) {
      const element = document.getElementById(activeId);
      if (element) {
        element.focus({ preventScroll: true });
      }
    }
  }

  function checkQuiz(id) {
    const quest = findQuest(id);
    if (!quest) {
      return;
    }
    const draft = drafts[id] || {};
    const correct = quest.quiz.map(function (item, index) {
      return draft[index] === item.answer;
    });
    results[id] = {
      checked: quest.quiz.map(function () {
        return true;
      }),
      correct: correct
    };
    if (correct.every(Boolean)) {
      state.quiz[id] = true;
      saveState();
    }
  }

  function copyText(text, button) {
    const finish = function () {
      button.textContent = "Copied";
      window.setTimeout(function () {
        button.textContent = "Copy";
      }, 1500);
    };
    const fallback = function () {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        finish();
      } catch (error) {
        button.textContent = "Press Ctrl+C";
      }
      document.body.removeChild(area);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(finish, fallback);
    } else {
      fallback();
    }
  }

  function clearObject(target) {
    Object.keys(target).forEach(function (key) {
      delete target[key];
    });
  }

  function onClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }
    const action = target.getAttribute("data-action");
    if (action === "check-quiz") {
      checkQuiz(target.getAttribute("data-quest"));
      rerender();
    } else if (action === "copy") {
      const code = target.parentElement.querySelector("code");
      copyText(code.textContent, target);
    } else if (action === "reset") {
      if (window.confirm("Reset all progress saved in this browser?")) {
        state = defaultState();
        clearObject(drafts);
        clearObject(results);
        saveState();
        rerender();
      }
    }
  }

  function onChange(event) {
    const target = event.target;
    if (target.matches("input[data-step]")) {
      const quest = findQuest(target.getAttribute("data-quest"));
      const index = Number(target.getAttribute("data-index"));
      if (!Array.isArray(state.steps[quest.id])) {
        state.steps[quest.id] = [];
      }
      state.steps[quest.id][index] = target.checked;
      saveState();
      rerender();
    } else if (target.matches("input[data-answer]")) {
      const id = target.getAttribute("data-quest");
      const qi = Number(target.getAttribute("data-q"));
      if (!drafts[id]) {
        drafts[id] = {};
      }
      drafts[id][qi] = Number(target.value);
      if (results[id]) {
        results[id].checked[qi] = false;
      }
      rerender();
    } else if (target.id === "unlockAll") {
      state.unlockAll = target.checked;
      saveState();
      rerender();
    } else if (target.id === "plannerBadge") {
      updatePlanner();
    }
  }

  function onInput(event) {
    const target = event.target;
    if (target.id === "playerName") {
      state.name = target.value.slice(0, 30);
      saveState();
    } else if (target.id === "plannerCount") {
      updatePlanner();
    }
  }

  app.addEventListener("click", onClick);
  app.addEventListener("change", onChange);
  app.addEventListener("input", onInput);
  window.addEventListener("hashchange", function () {
    render(true);
  });

  render(false);
})();
