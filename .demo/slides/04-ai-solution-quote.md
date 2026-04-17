---
layout: quote
---

# AI brought the problem, AI also brings the solution

---
layout: section
---

# Act 2

AI as your testing partner

---

# Playwright Test Agents

Three agents, shipped with Playwright. Initialise in one command.

```bash
npx playwright init-agents --loop=vscode
```

<br />

**🎭 Planner**

Explores the running app and produces a human-readable Markdown test plan.

**🎭 Generator**

Turns the Markdown plan into executable TypeScript — verifies selectors live before writing them.

**🎭 Healer**

Replays failing tests, inspects the current DOM, and patches broken locators automatically.

---
layout: default
---

# The Planner

*"Explore the app and tell me what to test."*

**Input:** a prompt in Copilot Chat (Agent Mode)

**What it does:**
- Runs the seed test to start the web server and initialise fixtures
- Navigates the app with Playwright MCP tools
- Discovers every user flow for every persona
- Writes a structured Markdown test plan

**Output:** `specs/approval-workflow.md` — human-readable, reviewable, shareable

> The plan is the contract between your app and your test suite.
> You can read it. Your QA lead can review it. Then hand it to the Generator.
