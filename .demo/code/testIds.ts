/**
 * Test IDs for E2E testing of the Approval Portal
 * Centralized constants for maintaining consistent test selectors
 */

export const TEST_IDS = {
  // Login Screen
  LOGIN: {
    SCREEN: 'login-screen',
    USER_TILE_SUBMITTER: 'user-tile-submitter',
    USER_TILE_APPROVER: 'user-tile-approver',
  },

  // Navigation
  NAVIGATION: {
    USER_NAME: 'nav-user-name',
    USER_BADGE: 'nav-user-badge',
    SIGN_OUT_BTN: 'btn-sign-out',
  },

  // Dashboard
  DASHBOARD: {
    PAGE_TITLE: 'page-title',
    PAGE_SUBTITLE: 'page-subtitle',
    SUBMIT_BTN: 'btn-submit-document',
  },

  // Stats
  STATS: {
    PENDING: 'stat-pending',
    APPROVED: 'stat-approved',
    REJECTED: 'stat-rejected',
  },

  // Filters
  FILTERS: {
    TAB_ALL: 'filter-tab-all',
    TAB_PENDING: 'filter-tab-pending',
    TAB_APPROVED: 'filter-tab-approved',
    TAB_REJECTED: 'filter-tab-rejected',
  },

  // Search
  SEARCH: {
    INPUT: 'search-input',
  },

  // Document List
  DOCUMENTS: {
    LIST: 'document-list',
    ROW: 'document-row',
    TITLE: 'doc-title',
    STATUS: 'doc-status',
    REVIEW_BTN: 'btn-review',
    VIEW_BTN: 'btn-view',
    EMPTY_STATE: 'empty-state',
  },

  // Submit Modal
  SUBMIT_MODAL: {
    MODAL: 'submit-modal',
    CLOSE_BTN: 'btn-close-submit-modal',
    TITLE_INPUT: 'doc-title',
    CATEGORY_SELECT: 'doc-category',
    DESCRIPTION_TEXTAREA: 'doc-description',
    PRIORITY_LOW: 'priority-low',
    PRIORITY_NORMAL: 'priority-normal',
    PRIORITY_HIGH: 'priority-high',
    CANCEL_BTN: 'btn-cancel-submit',
    SUBMIT_BTN: 'btn-submit-form',
  },

  // Review Modal
  REVIEW_MODAL: {
    MODAL: 'review-modal',
    CLOSE_BTN: 'btn-close-review-modal',
    TITLE: 'review-title',
    STATUS: 'review-status',
    COMMENT_TEXTAREA: 'review-comment',
    CANCEL_BTN: 'btn-cancel-review',
    REJECT_BTN: 'btn-reject',
    APPROVE_BTN: 'btn-approve',
  },

  // Toast Notifications
  TOAST: {
    CONTAINER: 'toast-container',
    MESSAGE: 'toast-message',
  },
} as const;

// Helper function to get test ID selector for Playwright
export const getTestIdSelector = (testId: string) => `[data-testid="${testId}"]`;

// Helper function to get nested test ID from the TEST_IDS object
export const getTestId = (path: string) => {
  const keys = path.split('.');
  let current: any = TEST_IDS;
  
  for (const key of keys) {
    current = current[key];
    if (current === undefined) {
      throw new Error(`Test ID path "${path}" not found`);
    }
  }
  
  return current;
};

// Export individual sections for convenience
export const {
  LOGIN,
  NAVIGATION,
  DASHBOARD,
  STATS,
  FILTERS,
  SEARCH,
  DOCUMENTS,
  SUBMIT_MODAL,
  REVIEW_MODAL,
  TOAST,
} = TEST_IDS;