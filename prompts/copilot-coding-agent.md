# GitHub Copilot Coding Agent + Playwright MCP

## What this is

GitHub Copilot Coding Agent is built into GitHub.com.
When you assign it a GitHub issue, it:

1. Reads the issue description
2. Checks out the repo in a sandboxed environment
3. Writes code to implement or fix what's described
4. **Opens a real browser via Playwright MCP** to verify the feature works
5. Pushes a pull request with the result

No configuration needed — Playwright MCP is built in.

---

## Demo scenario

Create a GitHub issue with this content:

```markdown
Title: Add a "priority filter" to the dashboard

The dashboard currently has tabs for All / Pending / Approved / Rejected.
Add a fourth filter that shows only High priority documents.

Acceptance criteria:
- A "High priority" tab appears next to the existing filter tabs
- Clicking it filters the list to documents with priority = "high"
- The existing Playwright tests must still pass after the change
```

Then assign the issue to Copilot.

---

## What you'll see in the PR

- Code changes to `apps/approval-portal/js/app.js` and `index.html`
- A new test file in `tests/approval/`
- A comment from Copilot: *"I verified this feature by opening the app at localhost:3000,
  clicking the High priority tab, and confirming the filtered list matched."*

---

## The key point to land with the audience

> Copilot Coding Agent doesn't just write code and hope for the best.
> It tests its own work in a real browser — using the same Playwright setup
> we've built in this session. The loop closes.

---

## Live URL

Open this during the demo to show the Copilot PR in progress:
`https://github.com/<your-repo>/pulls`
