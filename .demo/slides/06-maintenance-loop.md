---
layout: default
transition: slideLeft
---


# The maintenance loop

Every team I talk to is stuck in the same cycle.

1. **UI changes** — a designer renames a button, a component gets refactored
2. **Tests silently break** — locators stop resolving, nothing tells you
3. **CI turns red** — you get 400 lines of ANSI output and no context
4. **Manual fixes** — someone digs in, updates the selector, pushes a patch
5. **Repeat** — two weeks later, another UI change, same loop

> You're not spending too much time writing tests.
> You're spending too much time **maintaining** them after someone changed a label.

