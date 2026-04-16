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

