# Planner prompt (copy into Copilot Chat — Agent Mode)

> Switch to **Agent Mode** in Copilot Chat before running this.
> Select the **planner** agent from the agent picker.

---

```
@planner Generate a full test plan for the document submission workflow.

Use tests/seed.spec.ts as the seed.

Cover both the submitter persona (Alex Chen) and the approver persona (Morgan Lee).
Include happy paths, validation errors, and edge cases.

Save the output to specs/approval-workflow.md
```

---

## What the Planner will do

1. Run `tests/seed.spec.ts` to start the web server
2. Navigate the app with Playwright MCP tools
3. Explore both personas by clicking the login tiles
4. Document every distinct user flow as numbered scenarios
5. List all `data-testid` attributes it finds — ready for the Generator

## Expected output

`specs/approval-workflow.md` — a human-readable test plan with:
- Application context
- Persona table
- Step-by-step scenarios with expected results
- Edge cases per scenario
- Stable test ID appendix
