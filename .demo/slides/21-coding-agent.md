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

