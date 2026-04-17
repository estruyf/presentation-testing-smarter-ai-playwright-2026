
## File naming

Place generated tests in `tests/<feature>/`:
- `tests/approval/submit-document.spec.ts`
- `tests/approval/review-document.spec.ts`
- `tests/approval/dashboard-filters.spec.ts`

## Approver tests

For tests that need the **approver** persona, add this at the top of the file:

```typescript
import { STORAGE_STATE_APPROVER } from "../../playwright.config";
test.use({ storageState: STORAGE_STATE_APPROVER });
```