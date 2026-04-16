# Testing smarter: Bringing AI into your E2E testing workflows

> Techorama 2026 · ECS 2026

End-to-end testing with Playwright is something I use daily. But maintaining
tests in a rapidly changing environment costs more time than writing them.
This session shows how AI tools — specifically Playwright Test Agents,
GitHub Copilot Coding Agent, and Claude — change that equation.

---

## What this repo contains

| Folder / file | What it is |
|---|---|
| `apps/approval-portal/` | The demo app — a document approval portal |
| `tests/` | Playwright test suite (auth setup, fixtures, approval tests) |
| `tests/approval/broken-for-healer.spec.ts` | Intentionally broken tests for the Healer demo |
| `specs/` | Planner output — human-readable test plans |
| `.github/agents/` | Playwright Test Agent definitions (planner, generator, healer) |
| `.github/workflows/` | CI workflow with AI failure analysis |
| `scripts/analyze-failures.js` | Reads Playwright JSON results and calls Claude for root-cause analysis |
| `prompts/` | Ready-to-paste Copilot Chat prompts for each demo |
| `.demo/demo.json` | Demo Time configuration — all session demos sequenced |
| `SPEAKER_NOTES.md` | Full slide outline with speaker script and timing guide |

---

## Session structure

### Act 1 — The problem (5 min)
The maintenance loop. Tests that break when someone renames a button.
Logs nobody wants to read.

### Act 2 — AI as your testing partner (30 min)
- **Playwright Test Agents** — Planner writes the spec, Generator writes the tests, Healer fixes them
- **AI failure analysis** — CI posts a PR comment with root cause, not 400 lines of ANSI
- **The Healer** — one prompt repairs broken locators automatically

### Act 3 — The resilient setup (15 min)
Pre-auth sessions + Playwright agents + GitHub Copilot Coding Agent closing the loop.

---

## Getting started

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium

# Start the demo app
npm run serve

# Create auth sessions (run once)
npm run test:auth

# Run the full suite
npm test

# Run with UI mode
npm run test:ui
```

---

## The demo app

The **Approval Portal** is a document approval workflow app with two user personas:

| Name | Role | What they can do |
|---|---|---|
| Alex Chen | Submitter | Submit documents, track status |
| Morgan Lee | Approver | Review, approve, reject documents |

It uses `localStorage` for persistence and `sessionStorage` for session state —
no backend required for demos.

---

## Playwright Test Agents

Initialise the agents for your preferred AI tool:

```bash
# VS Code + Copilot
npm run agents:init

# Claude Code
npm run agents:init:claude
```

Agent definitions are written to `.github/agents/`. Regenerate whenever you update Playwright.

### Suggested prompts

See the `prompts/` folder for ready-to-use Copilot Chat prompts for each agent.

---

## AI failure analysis

The `scripts/analyze-failures.js` script reads Playwright's JSON reporter output
and calls Claude to produce a concise root-cause summary.

```bash
# Run the broken tests to generate results
npm run test:broken -- --reporter=json

# Run the analysis
ANTHROPIC_API_KEY=your-key npm run analyze
```

Output: `test-results/ai-summary.md`

In CI, this runs automatically when tests fail and posts the summary as a PR comment.
Requires `ANTHROPIC_API_KEY` set as a GitHub Actions secret.

---

## Pre-session checklist

- [ ] `npm install` completed
- [ ] `npm run serve` running on port 3000
- [ ] `npm run test:auth` completed (`.auth/` files present)
- [ ] `ANTHROPIC_API_KEY` set: `export ANTHROPIC_API_KEY=sk-ant-...`
- [ ] VS Code Demo Time extension installed
- [ ] Copilot Chat — Agent Mode enabled
- [ ] Browser and terminal font sizes bumped for back-row visibility

---

## Resources

- [Playwright Test Agents](https://playwright.dev/docs/test-agents)
- [Playwright MCP](https://playwright.dev/mcp/introduction)
- [GitHub Copilot Coding Agent](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent)
- [Demo Time VS Code extension](https://marketplace.visualstudio.com/items?itemName=eliostruyf.vscode-demo-time)

---

Template based on [estruyf/demo-time-espc25-template](https://github.com/estruyf/demo-time-espc25-template)
