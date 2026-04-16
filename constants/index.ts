export const ROUTES = {
  home: "/",
} as const;

export const USERS = {
  submitter: {
    username: "alex",
    name: "Alex Chen",
    role: "submitter",
  },
  approver: {
    username: "morgan",
    name: "Morgan Lee",
    role: "approver",
  },
} as const;

export const CATEGORIES = [
  "finance",
  "hr",
  "legal",
  "operations",
  "strategy",
] as const;

export const PRIORITIES = ["low", "normal", "high"] as const;

export const STATUSES = ["pending", "approved", "rejected"] as const;

export const TEST_DOCUMENTS = {
  standard: {
    title: "Q1 Compliance Report",
    category: "legal",
    description: "Annual compliance summary for Q1.",
    priority: "normal" as const,
  },
  highPriority: {
    title: "Annual Security Audit",
    category: "operations",
    description: "Full security audit findings.",
    priority: "high" as const,
  },
  financeDoc: {
    title: "Q4 Budget Review",
    category: "finance",
    priority: "normal" as const,
  },
} as const;
