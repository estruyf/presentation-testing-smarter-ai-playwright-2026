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

