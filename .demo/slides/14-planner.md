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

