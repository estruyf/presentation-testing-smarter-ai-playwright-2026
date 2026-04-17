---
theme: default
---

# Testing smarter

Bringing AI into your E2E testing workflows

&mdash; Elio Struyf &nbsp;·&nbsp; Techorama 2026 &nbsp;·&nbsp; ECS 2026

---
layout: default
---

# About me

- **Microsoft MVP** (11×) · **GitHub Star** · **Google Developer Expert**
- President of **BIWUG** — Belgian Information Worker User Group
- Speaker since 2012 — Microsoft Ignite, GitHub Universe, OpenAI DevDays, Techorama
- Creator of **Demo Time**, **Front Matter CMS**, **EngageTime**, **visitorbadge.io**
- Solution Architect at IceFire Studios & Involv Intranet

&mdash; [@estruyf](https://bsky.app/profile/eliostruyf.com) &nbsp;·&nbsp; [elio.dev](https://www.eliostruyf.com)

---
layout: quote
---

# "When did you last look at a green CI run and **actually trust** it?"

---
layout: intro
---

# Testing is more important than ever

---
layout: default
---

# Who changes your application?

**👩‍💻 Developers**

New features, refactors, dependency upgrades. Always have.

**🎨 Designers**

Component updates, renamed labels, layout changes. Always have.

**🤖 AI**

GitHub Copilot, Coding Agents, vibe coding tools. Writing production code. Right now. Faster than any human ever did.

> Every one of these actors can break your tests without knowing it.
> AI might not even know your test suite exists.

---
layout: default
---

# Why E2E testing is more important than ever

Three things have changed — all at once.

1. **AI ships code at a pace humans can't review fully** — Copilot Coding Agent can open a PR in minutes. Your test suite is the only systematic check.
2. **The pain isn't just broken tests** — it's writing tests at all when the app is changing this fast. By the time you finish writing a test, the feature has moved.
3. **Feature volume has outpaced QA capacity** — teams are shipping more with fewer people. Manual testing can't cover the surface area anymore.

---
layout: section
---

# E2E testing isn't a nice-to-have. It's your last line of defence.

# **The question is whether you can keep up with AI.**

---
layout: intro
---

# But it is slow, costs a lot, and is hard to maintain

---
layout: default
---

# Why writing tests can be slow

1. Understanding the flow(s)
2. Translating actions into code
3. Finding reliable selectors in complex UIs
4. Debugging flaky tests
5. Maintenance — every UI change is a manual fix

---
layout: intro
---

# 🤖 + 🐢 = 🐆

---
layout: intro
---

# It depends...

---
layout: intro
---

# The app and its complexity

---
layout: default
---

# What we're building today

A complete, AI-assisted E2E testing setup — built around one real app.

::right::

- ✅ **Approval Portal** — the demo app (document workflow, two personas)
- ✅ **Pre-authenticated sessions** — authenticate once, reuse everywhere
- ✅ **Playwright Test Agents** — Planner, Generator, Healer
- ✅ **AI failure analysis** — root cause in plain language, not 400 log lines
