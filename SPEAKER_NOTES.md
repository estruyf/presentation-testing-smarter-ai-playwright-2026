# Testing smarter: Bringing AI into your E2E testing workflows
## Techorama 2026 / ECS 2026 — Speaker notes

---

## Slide 1 — Title

**On screen:** Session title + your name

**Say:**
Nothing yet. Let it breathe. Walk on, let people settle.

---

## Slide 2 — The question everyone's avoiding

**On screen:** "When did you last trust your test suite 100%?"

**Say:**
I want to start with an honest question. Not "do you write Playwright tests" —
I'm guessing most of you do, or you wouldn't be in this room.

The question is: when did you last look at a green CI run and think "yes,
I'm confident every feature works"?

For most teams, the answer is: a while ago. Because somewhere between
the deadline pressure, the UI refactor, the component library upgrade —
the tests drifted. They still run. They just don't tell you what you need to know.

---

## Slide 3 — "When did you last trust your CI?"

**Say:**
Nothing yet. Let it sit for a second.

---

## Slide 4 — Who changes your application?

**On screen:** Three actors — devs, designers, AI

**Say:**
We always knew about devs and designers. A developer refactors a component,
a designer renames a button — tests break. We've been dealing with that for years.

But there's a third actor now. GitHub Copilot. Coding Agents. Vibe coding tools.
AI is writing production code today, right now, in your repos.
And it's doing it faster than any human ever has.

Here's the thing: AI doesn't know your test suite exists.
It doesn't know that `btn-submit-form` is the selector your Playwright test depends on.
It just ships the feature.

Every one of these actors can break your tests without knowing it.
The difference is that AI does it at a velocity you can't manually keep up with.

---

## Slide 5 — Why E2E is more important than ever

**On screen:** Three shifts happening at once

**Say:**
Three things have changed simultaneously — and together they've created a problem
that didn't exist three years ago.

First: AI ships code at a pace humans can't fully review. A Copilot Coding Agent
can open a PR in minutes. Your test suite is the only systematic check left.

Second: the pain isn't just tests breaking anymore. It's writing tests at all.
When the app is changing this fast — features added by AI, UI tweaked by designers,
APIs updated by backend teams — by the time you finish writing a test,
the thing you were testing has already moved.

Third: feature volume has outpaced QA capacity. Teams are shipping more
with fewer people. Manual testing can't cover the surface area.

E2E testing isn't a nice-to-have. It's your last line of defence.
The question isn't whether you should do it — it's whether you can keep up with AI.

That's what this session is about.

---

## Slide 6 — The maintenance loop

**On screen:** The three-stage loop: UI changes → CI fails → Manual fixes → repeat

**Say:**
Here's what the loop looks like in practice.

A designer renames a button. Your test looked for "New request" — the button is
now "+ Submit document". Red CI. Someone digs into the logs, finds the locator,
updates it, pushes a fix. Two weeks later, a component library upgrade moves the
form fields around. Same thing.

You're not spending too much time writing tests.
You're spending too much time **maintaining** them after someone changed a label.

This is the problem we're fixing today.

---

## Slide 7 — What we're building

**On screen:** Architecture diagram — App → Auth sessions → Test suite → AI agents → CI

**Say:**
Here's what we'll have by the end of this session.

A document approval app — similar to SharePoint approval workflows, familiar
territory for most of you. A Playwright suite covering submitters and approvers.
Pre-authenticated sessions so we never log in during a test. Three AI agents
that write, verify, and repair tests automatically. And a CI workflow that
tells us *why* it broke instead of just *that* it broke.

Let's build it.

---

## Slide 5 — Meet the app [DEMO starts]

**On screen:** Browser showing the Approval Portal

**Say:**
This is our demo app. A document approval portal — think SharePoint approval
workflow, simplified. Two personas: Alex, a submitter. Morgan, an approver.

Documents flow from pending through review to approved or rejected. Simple,
but it has enough moving parts to make testing interesting: modals, form validation,
status updates, role-based UI differences.

Walk through the app briefly — login as Alex, show the dashboard, submit a document.
Switch to Morgan, show the review flow.

---

## Slide 6 — Pre-authenticated sessions

**On screen:** `tests/auth/auth.setup.ts`

**Say:**
Before any test runs, we handle authentication once.

This setup test logs in as Alex, saves the session state to `.auth/submitter.json`.
Same for Morgan. Every test in the suite loads that state file instead of
going through the login screen.

Two benefits: tests are faster — no login page overhead. And tests are more
reliable — login pages are one of the top sources of flakiness.

When you need to test as the approver, you point to the other file.
One line. No login code in your tests at all.

**[Show the config file — highlight `storageState` in the projects]**

---

## Slide 7 — The problem test

**On screen:** `tests/approval/broken-for-healer.spec.ts`

**Say:**
This is a test that was written six months ago. The UI has moved on.
The button was renamed. The form fields got new IDs. Nobody noticed,
because the test only runs in CI, and CI is showing red on seventeen
other things anyway.

Let me run it.

**[Run the broken tests — show the failure output]**

Three seconds of output. Locators not found. What changed?
Who changed it? Which file? Which line?

This is the 11pm debugging session that AI is about to eliminate.

---

## Slide 8 — Introducing Playwright Test Agents

**On screen:** Three cards: Planner / Generator / Healer

**Say:**
Playwright now ships with three built-in AI agents: the Planner,
the Generator, and the Healer.

They work together: the Planner explores your app and writes a test plan.
The Generator turns that plan into executable TypeScript. The Healer
repairs tests when they break.

You initialise them with one command.

**[Run `npm run agents:init`]**

This generates agent definitions in `.github/agents/` — instruction files
that tell your AI tool of choice how each agent should behave.
They're regenerated every time you update Playwright, so they stay current.

---

## Slide 9 — The Planner

**On screen:** `.github/agents/planner.md` + Copilot Chat agent mode

**Say:**
The Planner agent's job is to explore. You give it your seed test — a minimal
test that starts the app — and a prompt. It navigates the app using Playwright MCP,
discovers all the user flows, and writes a Markdown test plan.

Not code. A plan. Human-readable, reviewable, shareable with your QA team
or your product manager.

**[Show the seed test — explain why it's minimal]**

The seed test runs first. It boots the server, initialises fixtures.
The Planner uses it as a starting point for every generated test.

**[Switch to Copilot Chat, agent mode, type the planner prompt]**

---

## Slide 10 — Planner output

**On screen:** `specs/approval-workflow.md`

**Say:**
Look at what came back.

Numbered scenarios. Step-by-step instructions. Expected results.
Edge cases. An appendix of every `data-testid` attribute it found.

This is the contract between your app and your test suite.
You can read it, review it, change it. And then hand it to the Generator.

---

## Slide 11 — The Generator

**On screen:** `.github/agents/generator.md` + generated test file

**Say:**
The Generator takes the spec and produces real Playwright TypeScript.

The important part: it doesn't just write selectors from memory.
It opens the app with Playwright MCP, navigates to each screen,
and verifies the locator resolves before writing the assertion.

**[Switch to Copilot Chat, type the generator prompt]**

Watch the agent work. It's opening the browser, clicking around,
checking the DOM, writing the test. When it finds a locator that
doesn't match what's in the spec — it adapts.

**[Show the generated test file]**

Clean TypeScript. Using our fixtures. Using `data-testid` attributes
as the primary strategy — the most stable selector you can write.

**[Run the generated tests]**

First run. Green. Because the Generator verified every selector live
before it wrote a single assertion.

---

## Slide 12 — AI failure analysis

**On screen:** `.github/workflows/playwright.yml` — the AI analysis step

**Say:**
Now let's talk about CI.

When tests fail in CI, the standard experience is: 400 lines of ANSI output,
colour codes stripped, no context. You scroll, you grep, you maybe give up
and run it locally.

We added one step to the CI workflow. When the run fails, it calls Claude,
passes in the structured JSON results, and gets back a Markdown summary.
Posted as a PR comment before you've even opened the tab.

**[Show the analyze-failures.js script]**

The script reads the Playwright JSON reporter output — not the terminal output,
the structured data. It extracts failed test names, error messages, the line
that failed, retry count. Sends it to Claude with a focused prompt.

**[Run the local analysis demo — broken tests + analyze script]**

**[Show `test-results/ai-summary.md`]**

Root cause. Recommended fixes. Flakiness assessment.
In plain language, in under ten seconds.

---

## Slide 13 — The Healer

**On screen:** `.github/agents/healer.md`

**Say:**
Back to our broken test.

The Healer agent's workflow: run the failing test with trace enabled,
read the error, open the app with Playwright MCP, inspect the current DOM,
find the element that corresponds to the broken selector, patch the file,
re-run to confirm.

It doesn't rewrite your test. It doesn't change the assertion logic.
It finds the broken locator and fixes it. Nothing else.

**[Switch to Copilot Chat, type the healer prompt]**

**[Watch the agent work — let it run without commentary]**

**[Show the patched file]**

Five broken selectors. Five patches. Correct locators, all verified against
the live app. Nothing else changed.

**[Run the healed tests]**

Green. Same test. Same intent. Same assertions. Just updated selectors.

---

## Slide 14 — The full resilient setup

**On screen:** Architecture diagram — the complete loop

**Say:**
Let's put it together.

Pre-auth sessions: we authenticate once, reuse everywhere.
No login overhead. No auth flakiness.

The agents: the Planner maps new features, the Generator writes the tests,
the Healer keeps them green when the UI moves.

The CI workflow: tests run in parallel, failures get AI-analysed,
the summary lands on your PR before your standup.

And the last piece...

---

## Slide 15 — GitHub Copilot Coding Agent

**On screen:** GitHub issue → Copilot PR → Playwright verification

**Say:**
GitHub Copilot Coding Agent takes this one step further.

You create a GitHub issue. You assign it to Copilot. It reads the issue,
writes the code, and then — this is the part that matters —
it opens a real browser using the Playwright MCP server built into Copilot,
navigates to the app, and verifies the feature works.

**[Show the Copilot Coding Agent prompt file — explain the demo scenario]**

No configuration. Playwright MCP is built into the Coding Agent.
Your test setup — the auth sessions, the `data-testid` attributes,
the fixtures — that's the infrastructure Copilot uses to verify its own work.

The loop closes. AI writes the feature. AI tests the feature.
Your job is to review the PR.

---

## Slide 16 — Run the full suite

**On screen:** Terminal — `npm test`

**Say:**
One last run. The full suite.

Auth setup runs first — creates the session files.
Main suite runs next — submitter tests with Alex's session,
approver tests with Morgan's session.
Parallel execution.

**[Run `npm test` — let it complete]**

All green.

---

## Slide 17 — What changed

**On screen:** Before / After comparison

| Before | After |
|---|---|
| Write tests manually | Planner + Generator write them |
| Hunt through logs on failure | AI summary on the PR |
| Fix locators by hand | Healer patches automatically |
| Log in at the start of every test | Auth once, reuse everywhere |
| Copilot writes code, you test it | Copilot writes code and tests it |

**Say:**
This isn't about replacing test engineers. It's about removing the work
that drains energy and adds no value — maintenance, log reading, locator hunting.

The work that's left — deciding what to test, reviewing AI-generated specs,
understanding what a failure means for your users — that's the work that matters.

---

## Slide 18 — Resources

**On screen:** Links

- **This repo:** `github.com/estruyf/presentation-testing-smarter-ai-playwright`
- **Playwright Test Agents:** `playwright.dev/docs/test-agents`
- **Playwright MCP:** `playwright.dev/mcp/introduction`
- **GitHub Copilot Coding Agent:** `docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent`
- **Demo Time (VS Code extension):** `marketplace.visualstudio.com/items?itemName=eliostruyf.vscode-demo-time`

**Say:**
The repo has everything — the app, the tests, the agents, the CI workflow.
Fork it, break it, heal it.

Questions?

---

## Timing guide

| Section | Slides | Time |
|---|---|---|
| Intro + problem | 1–4 | 5 min |
| App + pre-auth | 5–6 | 5 min |
| Agents: Planner + Generator | 7–11 | 15 min |
| AI failure analysis | 12 | 8 min |
| Healer | 13 | 7 min |
| Full setup + Copilot Agent | 14–16 | 8 min |
| Wrap-up | 17–18 | 2 min |
| **Total** | | **~50 min** |

---

## Pre-session checklist

- [ ] `npm install` completed
- [ ] `npm run serve` running on port 3000
- [ ] `npm run test:auth` completed — `.auth/` files exist
- [ ] `ANTHROPIC_API_KEY` set in environment (for failure analysis demo)
- [ ] VS Code Demo Time extension installed and `.demo/demo.json` loaded
- [ ] Copilot Chat open, Agent Mode enabled
- [ ] Browser zoomed to 130% for back-row visibility
- [ ] Terminal font size at 16px minimum
- [ ] Notifications silenced
- [ ] Demo Time: press `Cmd+Shift+P` → "Demo Time: Start" to begin
