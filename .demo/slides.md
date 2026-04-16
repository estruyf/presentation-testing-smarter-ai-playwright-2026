---
theme: default
transition: slideLeft
---

# Testing smarter

Bringing AI into your E2E testing workflows

&mdash; Elio Struyf &nbsp;·&nbsp; Techorama 2026 &nbsp;·&nbsp; ECS 2026

---
layout: default
transition: slideLeft
---

# About me

- **Microsoft MVP** (11×) · **GitHub Star** · **Google Developer Expert**
- President of **BIWUG** — Belgian Information Worker User Group
- Speaker since 2012 — Microsoft Ignite, GitHub Universe, OpenAI DevDays, Techorama
- Creator of **Demo Time**, **Front Matter CMS**, **EngageTime**, **visitorbadge.io**
- Principal developer on **PTFE / PF365 / PFT Server** at IceFire Studios

&mdash; [@estruyf](https://bsky.app/profile/eliostruyf.com) &nbsp;·&nbsp; [elio.dev](https://www.eliostruyf.com)

---
layout: quote
transition: slideLeft
---

# "When did you last look at a green CI run and **actually trust** it?"

---
layout: default
transition: slideLeft
---

# Who changes your application?

We always knew about the first two. The third one is new.

::right::

**👩‍💻 Developers**
New features, refactors, dependency upgrades. Always have.

**🎨 Designers**
Component updates, renamed labels, layout changes. Always have.

**🤖 AI**
GitHub Copilot, Coding Agents, vibe coding tools. Writing production code. Right now. Faster than any human ever did.

> Every one of these actors can break your tests without knowing it.
> AI doesn't know your test suite exists.

---
layout: default
transition: slideLeft
---

# Why E2E testing is more important than ever

Three things have changed — all at once.

1. **AI ships code at a pace humans can't review fully** — Copilot Coding Agent can open a PR in minutes. Your test suite is the only systematic check.

2. **The pain isn't just broken tests** — it's writing tests at all when the app is changing this fast. By the time you finish writing a test, the feature has moved.

3. **Feature volume has outpaced QA capacity** — teams are shipping more with fewer people. Manual testing can't cover the surface area anymore.

> E2E testing isn't a nice-to-have. It's your last line of defence.
> **The question is whether you can keep up with AI.**

---
layout: default
transition: slideLeft
---

# The maintenance loop

Every team I talk to is stuck in the same cycle.

1. **UI changes** — a designer renames a button, a component gets refactored
2. **Tests silently break** — locators stop resolving, nothing tells you
3. **CI turns red** — you get 400 lines of ANSI output and no context
4. **Manual fixes** — someone digs in, updates the selector, pushes a patch
5. **Repeat** — two weeks later, another UI change, same loop

> You're not spending too much time writing tests.
> You're spending too much time **maintaining** them after someone changed a label.

---
layout: default
transition: slideLeft
---

# What we're building today

A complete, AI-assisted E2E testing setup — built around one real app.

::right::

- ✅ **Approval Portal** — the demo app (document workflow, two personas)
- ✅ **Pre-authenticated sessions** — authenticate once, reuse everywhere
- ✅ **Playwright Test Agents** — Planner, Generator, Healer
- ✅ **AI failure analysis** — root cause in plain language, not 400 log lines
- ✅ **GitHub Copilot Coding Agent** — writes code and tests it in a real browser

---
layout: section
transition: slideLeft
---

# Act 1

The problem

---
layout: default
transition: slideLeft
---

# The demo app — Approval Portal

A document approval workflow. Two personas, one app.

::right::

**Alex Chen** — Submitter
- Submits documents for approval
- Tracks status (pending / approved / rejected)

**Morgan Lee** — Approver
- Reviews pending documents
- Approves or rejects with a comment

> Familiar territory for anyone who's built on SharePoint or Power Automate.
> Simple enough to demo, complex enough to test properly.

---
layout: default
transition: slideLeft
---

# Pre-authenticated sessions

Log in once. Every test reuses the session.

```typescript
// auth.setup.ts — runs once before the whole suite
setup("authenticate as submitter (Alex Chen)", async ({ page }) => {
  await page.goto("/");
  await page.locator(".user-tile[data-user='alex']").click();
  await expect(page.locator("#app-screen")).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE_SUBMITTER });
});
```

```typescript
// playwright.config.ts — switch persona with one line
test.use({ storageState: STORAGE_STATE_APPROVER });
```

**Benefits:** no login page overhead, no auth flakiness, instant persona switching

---
layout: section
transition: slideLeft
---

# Act 2

AI as your testing partner

---
layout: default
transition: slideLeft
---

# Playwright Test Agents

Three agents, shipped with Playwright. Initialise in one command.

```bash
npx playwright init-agents --loop=vscode
```

::right::

**🎭 Planner**
Explores the running app and produces a human-readable Markdown test plan.

**🎭 Generator**
Turns the Markdown plan into executable TypeScript — verifies selectors live before writing them.

**🎭 Healer**
Replays failing tests, inspects the current DOM, and patches broken locators automatically.

---
layout: default
transition: slideLeft
---

# The Planner

*"Explore the app and tell me what to test."*

**Input:** a seed test + a prompt in Copilot Chat (Agent Mode)

**What it does:**
- Runs the seed test to start the web server and initialise fixtures
- Navigates the app with Playwright MCP tools
- Discovers every user flow for every persona
- Writes a structured Markdown test plan to `specs/`

**Output:** `specs/approval-workflow.md` — human-readable, reviewable, shareable

> The plan is the contract between your app and your test suite.
> You can read it. Your QA lead can review it. Then hand it to the Generator.

---
layout: default
transition: slideLeft
---

# The Generator

*"Turn this spec into passing tests."*

**Input:** the Markdown plan from `specs/`

**What it does:**
- Opens the app with Playwright MCP tools
- Verifies every selector exists in the live DOM before writing an assertion
- Produces TypeScript using your fixtures and page objects
- Runs each generated file immediately — fixes any issues before finishing

**Key point:** tests pass on the **first run** because the Generator verified selectors live.

```typescript
// Generated output — live-verified locators
await page.getByTestId("doc-title").fill("Q1 Compliance Report");
await page.getByTestId("doc-category").selectOption("legal");
await page.getByTestId("btn-submit-form").click();
```

---
layout: section
transition: slideLeft
---

# When CI breaks

*"400 lines of ANSI output at 11pm"*

---
layout: default
transition: slideLeft
---

# AI failure analysis

CI fails. This step runs instead of your scroll session.

```yaml
# .github/workflows/playwright.yml
- name: Analyse test failures with AI
  if: failure() && steps.playwright.outcome == 'failure'
  run: node scripts/analyze-failures.js
```

**What `analyze-failures.js` does:**
1. Reads `test-results/results.json` from Playwright's JSON reporter
2. Extracts failed test names, error messages, retry counts, failing steps
3. Calls Claude with a focused prompt asking for root cause + recommended fixes
4. Writes `test-results/ai-summary.md`
5. Posts it as a PR comment before you've opened the tab

> Root cause. Recommended fixes. Flakiness assessment.
> In plain language, in under 10 seconds.

---
layout: default
transition: slideLeft
---

# The Healer

*"Fix the broken test. Don't touch anything else."*

**Healing process:**
1. Runs the failing test with `--trace=on`
2. Reads the error — which locator failed, which line
3. Opens the live app with Playwright MCP tools
4. Inspects the current accessibility snapshot
5. Finds the element that serves the same semantic role
6. Patches only the broken locator — nothing else changes
7. Re-runs to confirm green

**Locator priority the Healer follows:**
`getByTestId` → `getByRole` → `getByLabel` → `getByText` → CSS (last resort)

> If the feature was removed, the Healer marks the test `test.skip()` with a comment.
> It won't silently delete a test.

---
layout: section
transition: slideLeft
---

# Act 3

The resilient setup

---
layout: two-columns
transition: slideLeft
---

# Everything connected

**Foundation**

- Pre-auth sessions for both personas
- Stable `data-testid` attributes as primary locator strategy
- Page object fixtures (`DashboardPage`, `SubmitForm`, `ReviewModal`)
- Auth project → test projects dependency chain

::right::

**AI layer**

- Planner maps new features → spec in `specs/`
- Generator writes tests → verified against live app
- Healer repairs on break → patches only broken selectors
- CI analysis → PR comment with root cause

---
layout: default
transition: slideLeft
---

# GitHub Copilot Coding Agent

The loop closes.

**What it does:**
1. You create a GitHub issue describing a feature or bug
2. You assign it to Copilot
3. Copilot reads the issue, writes the code — and then...
4. **Opens a real browser via Playwright MCP** to verify the feature works
5. Pushes a pull request with passing tests

**No configuration needed.** Playwright MCP is built into the Coding Agent.

> Your pre-auth sessions, your `data-testid` attributes, your fixtures —
> that's the infrastructure Copilot uses to verify its own work.
>
> **AI writes the feature. AI tests the feature. You review the PR.**

---
layout: two-columns
transition: slideLeft
---

# What changed

**Before**

- Write tests manually by inspecting the DOM
- Hunt through 400 lines of CI logs at 11pm
- Fix broken locators by hand every sprint
- Log in at the start of every test
- Copilot writes code, *you* test it

::right::

**After**

- Planner + Generator write tests from the running app
- AI summary on the PR — root cause in plain language
- Healer patches locators automatically
- Authenticate once, reuse the session everywhere
- Copilot writes code *and* tests it in a real browser

---
layout: default
transition: slideLeft
---

# Resources

- **This repo** — [github.com/estruyf/presentation-testing-smarter-ai-playwright](https://github.com/estruyf/presentation-testing-smarter-ai-playwright)
- **Playwright Test Agents** — [playwright.dev/docs/test-agents](https://playwright.dev/docs/test-agents)
- **Playwright MCP** — [playwright.dev/mcp/introduction](https://playwright.dev/mcp/introduction)
- **GitHub Copilot Coding Agent** — [docs.github.com/copilot/coding-agent](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent)
- **Demo Time** — [demotime.show](https://demotime.show)
- **EngageTime** — [engagetime.live](https://engagetime.live)

---
layout: intro
transition: slideLeft
---

# Thank you

Questions?

&mdash; [@estruyf](https://bsky.app/profile/eliostruyf.com) &nbsp;·&nbsp; [elio.dev](https://www.eliostruyf.com)
