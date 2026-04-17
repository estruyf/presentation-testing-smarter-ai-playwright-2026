# Document Approval Portal - Comprehensive Test Plan

## Application Overview

A comprehensive test plan for the Document Approval Portal application covering the complete document submission and approval workflow. The application supports two user personas: Alex Chen (submitter) who can submit documents for approval, and Morgan Lee (approver) who can review and action pending documents. The workflow includes document submission with validation, filtering and search capabilities, and a complete review process with approval/rejection functionality.

## Test Scenarios

### 1. Authentication and User Personas

**Seed:** `tests/seed.spec.ts`

#### 1.1. Login as submitter (Alex Chen)

**File:** `tests/auth/login-submitter.spec.ts`

**Steps:**
  1. Navigate to the application homepage
    - expect: Login screen is displayed
    - expect: Application title 'Approval Portal' is visible
    - expect: Sign in heading is displayed
  2. Click on Alex Chen user tile
    - expect: Application navigates to main dashboard
    - expect: Navigation bar shows 'Alex Chen' with 'submitter' badge
    - expect: Page title shows 'My documents'
    - expect: Submit document button is visible
  3. Verify dashboard statistics are displayed
    - expect: Pending, Approved, and Rejected stat cards are visible
    - expect: Stats show numeric values

#### 1.2. Login as approver (Morgan Lee)

**File:** `tests/auth/login-approver.spec.ts`

**Steps:**
  1. Navigate to the application homepage
    - expect: Login screen is displayed
    - expect: Both user tiles (Alex and Morgan) are visible
  2. Click on Morgan Lee user tile
    - expect: Application navigates to main dashboard
    - expect: Navigation bar shows 'Morgan Lee' with 'approver' badge
    - expect: Page title shows 'Pending approvals'
    - expect: Submit document button is hidden
  3. Verify approver can see all documents including those from other users
    - expect: Document list shows documents from all submitters
    - expect: Review buttons are visible for pending documents

#### 1.3. Session persistence across page refreshes

**File:** `tests/auth/session-persistence.spec.ts`

**Steps:**
  1. Login as Alex Chen and refresh the page
    - expect: User remains logged in as Alex Chen
    - expect: Dashboard state is preserved
    - expect: No redirect to login screen
  2. Logout and verify session is cleared
    - expect: User is redirected to login screen
    - expect: Application state is reset

### 2. Document Submission Workflow (Submitter)

**Seed:** `tests/seed.spec.ts`

#### 2.1. Submit document happy path

**File:** `tests/submission/submit-document-happy-path.spec.ts`

**Steps:**
  1. Login as Alex Chen and click 'Submit document' button
    - expect: Submit document modal opens
    - expect: Modal title 'Submit document for approval' is displayed
    - expect: All form fields are visible and enabled
  2. Fill in document title 'Q1 Marketing Strategy'
    - expect: Title field accepts the input
    - expect: Field displays the entered text correctly
  3. Select category 'strategy' from dropdown
    - expect: Dropdown shows selected option
    - expect: All available categories are listed (finance, hr, legal, operations, strategy)
  4. Enter description 'Comprehensive marketing strategy for Q1 2026'
    - expect: Description field accepts multi-line input
    - expect: Text is displayed correctly in the textarea
  5. Select priority 'high' radio button
    - expect: High priority option is selected
    - expect: Other priority options are deselected
  6. Click 'Submit for approval' button
    - expect: Modal closes
    - expect: Success toast notification appears
    - expect: Document appears in the document list
    - expect: Pending statistics counter increments by 1
    - expect: Document status shows as 'pending'

#### 2.2. Submit document with minimal required fields only

**File:** `tests/submission/submit-minimal-document.spec.ts`

**Steps:**
  1. Open submit document modal and fill only required fields (title and category)
    - expect: Form accepts submission with only required fields
    - expect: Optional fields remain empty
  2. Submit the document with title 'Minimal Test Document' and category 'hr'
    - expect: Document is successfully submitted
    - expect: Priority defaults to 'normal'
    - expect: Description remains empty
    - expect: Document appears in list with correct details

#### 2.3. Form validation for required fields

**File:** `tests/submission/form-validation.spec.ts`

**Steps:**
  1. Open submit document modal and attempt to submit without entering title
    - expect: Form prevents submission
    - expect: Title field shows required field validation
    - expect: Focus moves to title field
  2. Enter title but leave category unselected and attempt to submit
    - expect: Form prevents submission
    - expect: Category dropdown shows required field validation
  3. Fill required fields and submit successfully
    - expect: Form submission succeeds after validation passes

#### 2.4. Form field validation and limits

**File:** `tests/submission/field-validation.spec.ts`

**Steps:**
  1. Test title field with extremely long text (500+ characters)
    - expect: Field accepts long text input
    - expect: Display handles long titles appropriately in the document list
  2. Test description field with very long text (2000+ characters)
    - expect: Textarea accepts long description
    - expect: Text wraps correctly in the field
  3. Test all category options selection
    - expect: All categories (finance, hr, legal, operations, strategy) can be selected
    - expect: Selected category is properly displayed
  4. Test all priority options selection
    - expect: All priority levels (low, normal, high) can be selected
    - expect: Priority badges display correctly with appropriate styling

#### 2.5. Cancel document submission

**File:** `tests/submission/cancel-submission.spec.ts`

**Steps:**
  1. Open submit document modal and partially fill the form
    - expect: Modal is open with partially filled form data
  2. Click 'Cancel' button
    - expect: Modal closes
    - expect: No document is created
    - expect: Dashboard statistics remain unchanged
  3. Click modal backdrop to close
    - expect: Modal closes when clicking outside the modal content
  4. Press Escape key to close modal
    - expect: Modal closes when pressing Escape key

### 3. Document Review Workflow (Approver)

**Seed:** `tests/seed.spec.ts`

#### 3.1. Review and approve document

**File:** `tests/review/approve-document.spec.ts`

**Steps:**
  1. Login as Morgan Lee and locate a pending document
    - expect: Dashboard shows pending documents
    - expect: Review buttons are visible for pending documents
    - expect: Document status shows as 'pending'
  2. Click 'Review' button on 'Q4 Budget Report' document
    - expect: Review modal opens
    - expect: Document details are displayed correctly
    - expect: Title shows 'Q4 Budget Report'
    - expect: Status shows 'pending'
    - expect: Approve and Reject buttons are visible
  3. Add comment 'Budget allocation looks reasonable and aligns with company goals'
    - expect: Comment text is entered in the comment field
    - expect: Text is displayed correctly
  4. Click 'Approve' button
    - expect: Review modal closes
    - expect: Success toast notification appears
    - expect: Document status changes to 'approved'
    - expect: Approved statistics counter increments
    - expect: Pending statistics counter decrements
  5. Verify approved document shows reviewer details
    - expect: Document list shows the comment in document meta
    - expect: Approved status badge is displayed with appropriate styling

#### 3.2. Review and reject document

**File:** `tests/review/reject-document.spec.ts`

**Steps:**
  1. Login as Morgan Lee and open review modal for a pending document
    - expect: Review modal displays pending document details
  2. Add comment 'Missing required financial projections and risk assessment'
    - expect: Rejection comment is entered successfully
  3. Click 'Reject' button
    - expect: Review modal closes
    - expect: Error toast notification appears
    - expect: Document status changes to 'rejected'
    - expect: Rejected statistics counter increments
    - expect: Pending statistics counter decrements
  4. Verify rejected document shows rejection details
    - expect: Document displays rejection comment
    - expect: Rejected status badge shows with appropriate styling

#### 3.3. Review document without comment

**File:** `tests/review/review-no-comment.spec.ts`

**Steps:**
  1. Open review modal for a pending document and approve without adding comment
    - expect: Approval succeeds without requiring comment
    - expect: Document status updates correctly
    - expect: No comment is displayed in document details
  2. Open review modal for another pending document and reject without comment
    - expect: Rejection succeeds without requiring comment
    - expect: Document status updates to rejected

#### 3.4. View approved and rejected document details

**File:** `tests/review/view-processed-documents.spec.ts`

**Steps:**
  1. Login as Morgan Lee and click 'View details' on an approved document
    - expect: Review modal opens in read-only mode
    - expect: Document details are displayed
    - expect: Action buttons (Approve/Reject) are not visible
    - expect: Only 'Close' button is available
  2. Verify approved document shows complete review history
    - expect: Review date and reviewer name are displayed
    - expect: Approval comment is visible if provided
    - expect: Status shows as 'approved'
  3. View details of a rejected document
    - expect: Rejection details are displayed
    - expect: Rejection comment is visible
    - expect: Review history shows rejection information

### 4. Document Filtering and Search

**Seed:** `tests/seed.spec.ts`

#### 4.1. Filter documents by status

**File:** `tests/filtering/status-filters.spec.ts`

**Steps:**
  1. Login as Alex Chen and click 'All' filter tab
    - expect: All documents submitted by Alex are displayed
    - expect: Documents with all statuses (pending, approved, rejected) are visible
  2. Click 'Pending' filter tab
    - expect: Only pending documents are displayed
    - expect: Approved and rejected documents are hidden
    - expect: Tab shows as active
  3. Click 'Approved' filter tab
    - expect: Only approved documents are shown
    - expect: All visible documents have 'approved' status
  4. Click 'Rejected' filter tab
    - expect: Only rejected documents are displayed
    - expect: All visible documents have 'rejected' status

#### 4.2. Search documents by title

**File:** `tests/filtering/search-functionality.spec.ts`

**Steps:**
  1. Enter 'Budget' in the search field
    - expect: Documents with 'Budget' in the title are displayed
    - expect: Non-matching documents are hidden
    - expect: Search is case-insensitive
  2. Search for 'Marketing'
    - expect: Only documents containing 'Marketing' in title are shown
    - expect: Search results update in real-time as typing
  3. Search for partial text 'Work Policy'
    - expect: Documents matching the partial text are displayed
    - expect: Partial matches work correctly
  4. Clear search field
    - expect: All documents are displayed again
    - expect: Filter state is preserved when search is cleared

#### 4.3. Search documents by category

**File:** `tests/filtering/search-by-category.spec.ts`

**Steps:**
  1. Search for 'finance' in the search field
    - expect: Documents in the finance category are displayed
    - expect: Category-based search works correctly
  2. Search for 'hr' category
    - expect: HR documents are shown
    - expect: Search matches category names

#### 4.4. Empty state handling

**File:** `tests/filtering/empty-states.spec.ts`

**Steps:**
  1. Search for text that doesn't match any documents
    - expect: Empty state message 'No documents found' is displayed
    - expect: Empty state icon is visible
    - expect: No document rows are shown
  2. Filter by status that has no documents
    - expect: Empty state is shown when no documents match the filter
    - expect: Message indicates no documents found
  3. Combine search and filter that results in no matches
    - expect: Empty state handles combined filters correctly

#### 4.5. Combined search and filter operations

**File:** `tests/filtering/combined-operations.spec.ts`

**Steps:**
  1. Apply 'Pending' filter and then search for specific text
    - expect: Only pending documents matching the search are displayed
    - expect: Both filter and search work together
  2. Search first then apply status filter
    - expect: Results show documents that match both search and filter criteria
  3. Switch between different filter tabs while maintaining search
    - expect: Search query persists across filter changes
    - expect: Results update correctly for each combination

### 5. Cross-Persona End-to-End Workflows

**Seed:** `tests/seed.spec.ts`

#### 5.1. Complete submission to approval workflow

**File:** `tests/e2e/submit-review-approve.spec.ts`

**Steps:**
  1. Login as Alex Chen and submit a new document with title 'E2E Test Document'
    - expect: Document is successfully submitted
    - expect: Document appears in Alex's pending list
  2. Logout and login as Morgan Lee
    - expect: Morgan's approver dashboard is displayed
    - expect: New document appears in Morgan's pending list
  3. Review and approve the 'E2E Test Document'
    - expect: Document status changes from pending to approved
    - expect: Statistics update correctly
  4. Logout and login back as Alex Chen
    - expect: Alex can see the document status as approved
    - expect: Approval comment is visible in document details

#### 5.2. Complete submission to rejection workflow

**File:** `tests/e2e/submit-review-reject.spec.ts`

**Steps:**
  1. Alex submits document 'Test Rejection Document'
    - expect: Document is created with pending status
  2. Morgan reviews and rejects with comment 'Needs more detail'
    - expect: Document status changes to rejected
    - expect: Rejection comment is recorded
  3. Alex views the rejected document
    - expect: Rejection status and comment are visible to the submitter

#### 5.3. Multiple documents workflow

**File:** `tests/e2e/multiple-documents.spec.ts`

**Steps:**
  1. Alex submits 3 different documents with different priorities and categories
    - expect: All 3 documents appear in pending list
    - expect: Statistics show +3 pending documents
  2. Morgan processes all 3 documents: approve 2, reject 1
    - expect: Statistics update correctly for each action
    - expect: Each document shows correct final status
  3. Verify final state shows correct distribution of statuses
    - expect: Approved count is 2
    - expect: Rejected count is 1
    - expect: Pending count is reduced accordingly

### 6. Edge Cases and Error Scenarios

**Seed:** `tests/seed.spec.ts`

#### 6.1. Boundary testing for form fields

**File:** `tests/edge-cases/boundary-testing.spec.ts`

**Steps:**
  1. Submit document with single character title 'A'
    - expect: Single character title is accepted
    - expect: Document is created successfully
  2. Submit document with maximum length title (test system limits)
    - expect: Very long titles are handled gracefully
    - expect: UI displays long titles appropriately
  3. Test special characters in title and description
    - expect: Special characters are properly escaped and displayed
    - expect: No XSS vulnerabilities exist

#### 6.2. Rapid successive operations

**File:** `tests/edge-cases/rapid-operations.spec.ts`

**Steps:**
  1. Submit multiple documents in rapid succession
    - expect: All documents are created correctly
    - expect: No race conditions or data corruption occurs
  2. Rapidly switch between filter tabs
    - expect: UI updates correctly for each filter change
    - expect: No performance issues or flickering
  3. Perform rapid search operations
    - expect: Search results update correctly for each query
    - expect: No performance degradation

#### 6.3. Modal and navigation edge cases

**File:** `tests/edge-cases/modal-navigation.spec.ts`

**Steps:**
  1. Open submit modal, then use browser back button
    - expect: Modal remains open and functional
    - expect: Application state is preserved
  2. Open multiple modals (if possible) and test interaction
    - expect: Only one modal is open at a time
    - expect: Modal stacking behaves correctly
  3. Test modal behavior with keyboard navigation (Tab, Escape, Enter)
    - expect: Keyboard navigation works as expected
    - expect: Focus management is proper

#### 6.4. Data persistence and state management

**File:** `tests/edge-cases/data-persistence.spec.ts`

**Steps:**
  1. Create documents, refresh browser, and verify data persistence
    - expect: Documents persist across page refreshes
    - expect: Application state is maintained
  2. Test behavior with corrupted localStorage data
    - expect: Application handles corrupted data gracefully
    - expect: Falls back to seed data if necessary
  3. Test with empty localStorage (first-time user scenario)
    - expect: Application initializes with seed data
    - expect: Default documents are available for testing approval workflow

#### 6.5. UI responsiveness and accessibility

**File:** `tests/edge-cases/accessibility.spec.ts`

**Steps:**
  1. Navigate entire application using only keyboard
    - expect: All interactive elements are keyboard accessible
    - expect: Tab order is logical
    - expect: Focus indicators are visible
  2. Test screen reader compatibility with form labels and buttons
    - expect: All form elements have proper labels
    - expect: Button purposes are clear
    - expect: Status messages are announced
  3. Verify color contrast and visual indicators
    - expect: Status badges have sufficient contrast
    - expect: Error states are clearly visible
    - expect: Interactive elements are distinguishable
