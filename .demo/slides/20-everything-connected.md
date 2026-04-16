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

