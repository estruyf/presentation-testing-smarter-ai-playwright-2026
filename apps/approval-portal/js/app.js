// --- State ---
let currentUser = null;
let currentFilter = 'all';

// --- Seed data ---
const SEED_DOCUMENTS = [
  {
    id: 'doc-001',
    title: 'Q4 Budget Report',
    category: 'finance',
    description: 'Full financial overview for Q4 including departmental breakdowns.',
    priority: 'high',
    status: 'pending',
    submittedBy: 'alex',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    comment: null,
  },
  {
    id: 'doc-002',
    title: 'Remote Work Policy Update',
    category: 'hr',
    description: 'Proposed changes to the hybrid work policy effective January.',
    priority: 'normal',
    status: 'pending',
    submittedBy: 'alex',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    comment: null,
  },
  {
    id: 'doc-003',
    title: 'Vendor Contract — Contoso Ltd',
    category: 'legal',
    description: 'Annual service agreement renewal with Contoso Ltd.',
    priority: 'high',
    status: 'approved',
    submittedBy: 'alex',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: 'morgan',
    comment: 'Approved after legal review.',
  },
  {
    id: 'doc-004',
    title: 'Marketing Campaign Brief',
    category: 'strategy',
    description: 'H1 campaign strategy for the EMEA region.',
    priority: 'low',
    status: 'rejected',
    submittedBy: 'alex',
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: 'morgan',
    comment: 'Needs revision — missing budget breakdown.',
  },
];

// --- Storage helpers ---
function getDocuments() {
  const raw = localStorage.getItem('approval-portal-docs');
  if (!raw) {
    localStorage.setItem('approval-portal-docs', JSON.stringify(SEED_DOCUMENTS));
    return SEED_DOCUMENTS;
  }
  return JSON.parse(raw);
}

function saveDocuments(docs) {
  localStorage.setItem('approval-portal-docs', JSON.stringify(docs));
}

function getSession() {
  const raw = localStorage.getItem('approval-portal-session');
  return raw ? JSON.parse(raw) : null;
}

function saveSession(user) {
  localStorage.setItem('approval-portal-session', JSON.stringify(user));
}

// --- Auth ---
const USERS = {
  alex: { name: 'Alex Chen', role: 'submitter', initial: 'A', color: '#0078d4' },
  morgan: { name: 'Morgan Lee', role: 'approver', initial: 'M', color: '#107c10' },
};

function login(username, role) {
  const user = USERS[username];
  if (!user) return;
  currentUser = { username, ...user };
  saveSession(currentUser);
  showApp();
}

function logout() {
  localStorage.removeItem('approval-portal-session');
  currentUser = null;
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app-screen').classList.add('hidden');
}

function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');

  document.getElementById('nav-user-name').textContent = currentUser.name;
  const badge = document.getElementById('nav-user-badge');
  badge.textContent = currentUser.role;
  badge.className = `role-badge role-${currentUser.role}`;

  document.getElementById('page-title').textContent =
    currentUser.role === 'approver' ? 'Pending approvals' : 'My documents';
  document.getElementById('page-subtitle').textContent =
    currentUser.role === 'approver'
      ? 'Review and action documents submitted for approval'
      : 'Track the status of your submitted documents';

  const submitBtn = document.getElementById('btn-submit');
  if (currentUser.role === 'submitter') {
    submitBtn.classList.remove('hidden');
  } else {
    submitBtn.classList.add('hidden');
  }

  renderStats();
  renderDocuments();
}

// --- Filters ---
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.filter === filter);
  });
  renderDocuments();
}

// --- Render ---
function renderStats() {
  const docs = getDocuments().filter((d) =>
    currentUser.role === 'submitter' ? d.submittedBy === currentUser.username : true
  );
  document.getElementById('stat-pending').textContent = docs.filter((d) => d.status === 'pending').length;
  document.getElementById('stat-approved').textContent = docs.filter((d) => d.status === 'approved').length;
  document.getElementById('stat-rejected').textContent = docs.filter((d) => d.status === 'rejected').length;
}

function renderDocuments() {
  const query = (document.getElementById('search-input')?.value || '').toLowerCase();
  let docs = getDocuments();

  if (currentUser.role === 'submitter') {
    docs = docs.filter((d) => d.submittedBy === currentUser.username);
  }
  if (currentFilter !== 'all') {
    docs = docs.filter((d) => d.status === currentFilter);
  }
  if (query) {
    docs = docs.filter(
      (d) => d.title.toLowerCase().includes(query) || d.category.toLowerCase().includes(query)
    );
  }

  const list = document.getElementById('document-list');
  if (docs.length === 0) {
    list.innerHTML = `<div class="empty-state" data-testid="empty-state">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="8" width="28" height="36" rx="3" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/>
        <path d="M16 18h16M16 24h12M16 30h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
      </svg>
      <p>No documents found</p>
    </div>`;
    return;
  }

  list.innerHTML = docs
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .map((doc) => renderDocumentRow(doc))
    .join('');
}

function renderDocumentRow(doc) {
  const date = new Date(doc.submittedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const priorityClass = `priority-${doc.priority}`;
  const statusClass = `status-${doc.status}`;
  const canReview = currentUser.role === 'approver' && doc.status === 'pending';

  return `
  <div class="document-row" data-testid="document-row" data-doc-id="${doc.id}" data-status="${doc.status}">
    <div class="doc-main">
      <div class="doc-title-row">
        <span class="doc-title" data-testid="doc-title">${escapeHtml(doc.title)}</span>
        <span class="badge ${priorityClass}">${doc.priority}</span>
      </div>
      <div class="doc-meta">
        <span class="meta-item category-badge">${doc.category}</span>
        <span class="meta-item">Submitted ${date}</span>
        ${doc.comment ? `<span class="meta-item comment">"${escapeHtml(doc.comment)}"</span>` : ''}
      </div>
    </div>
    <div class="doc-actions">
      <span class="status-badge ${statusClass}" data-testid="doc-status">${doc.status}</span>
      ${canReview
        ? `<button class="btn-outline" onclick="openReview('${doc.id}')" data-testid="btn-review">Review</button>`
        : `<button class="btn-ghost btn-small" onclick="openReview('${doc.id}')" data-testid="btn-view">View details</button>`
      }
    </div>
  </div>`;
}

// --- Submit document ---
function showSubmitForm() {
  document.getElementById('submit-modal').classList.remove('hidden');
  setTimeout(() => document.getElementById('doc-title').focus(), 50);
}

function submitDocument(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const docs = getDocuments();
  const newDoc = {
    id: `doc-${Date.now()}`,
    title: data.get('title'),
    category: data.get('category'),
    description: data.get('description') || '',
    priority: data.get('priority') || 'normal',
    status: 'pending',
    submittedBy: currentUser.username,
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    comment: null,
  };
  docs.unshift(newDoc);
  saveDocuments(docs);
  form.reset();
  closeModal('submit-modal');
  renderStats();
  renderDocuments();
  showToast(`"${newDoc.title}" submitted for approval`, 'success');
}

// --- Review document ---
function openReview(docId) {
  const docs = getDocuments();
  const doc = docs.find((d) => d.id === docId);
  if (!doc) return;

  const detailsEl = document.getElementById('review-doc-details');
  const actionsEl = document.getElementById('review-actions');
  const date = new Date(doc.submittedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  detailsEl.innerHTML = `
    <div class="review-field"><span class="review-label">Title</span><span class="review-value" data-testid="review-title">${escapeHtml(doc.title)}</span></div>
    <div class="review-field"><span class="review-label">Category</span><span class="review-value">${doc.category}</span></div>
    <div class="review-field"><span class="review-label">Priority</span><span class="review-value badge priority-${doc.priority}">${doc.priority}</span></div>
    <div class="review-field"><span class="review-label">Status</span><span class="review-value status-badge status-${doc.status}" data-testid="review-status">${doc.status}</span></div>
    <div class="review-field"><span class="review-label">Submitted</span><span class="review-value">${date} by ${USERS[doc.submittedBy]?.name || doc.submittedBy}</span></div>
    ${doc.description ? `<div class="review-field"><span class="review-label">Description</span><span class="review-value">${escapeHtml(doc.description)}</span></div>` : ''}
    ${doc.comment ? `<div class="review-field"><span class="review-label">Comment</span><span class="review-value comment-value">${escapeHtml(doc.comment)}</span></div>` : ''}
  `;

  if (currentUser.role === 'approver' && doc.status === 'pending') {
    actionsEl.innerHTML = `
      <div class="comment-group">
        <textarea id="review-comment" placeholder="Add a comment (optional)..." rows="2" data-testid="review-comment"></textarea>
      </div>
      <div class="action-buttons">
        <button class="btn-ghost" onclick="closeModal('review-modal')">Cancel</button>
        <button class="btn-danger" onclick="reviewDoc('${doc.id}', 'rejected')" data-testid="btn-reject">Reject</button>
        <button class="btn-success" onclick="reviewDoc('${doc.id}', 'approved')" data-testid="btn-approve">Approve</button>
      </div>
    `;
  } else {
    actionsEl.innerHTML = `<button class="btn-ghost" onclick="closeModal('review-modal')">Close</button>`;
  }

  document.getElementById('review-modal').classList.remove('hidden');
}

function reviewDoc(docId, decision) {
  const comment = document.getElementById('review-comment')?.value || '';
  const docs = getDocuments();
  const doc = docs.find((d) => d.id === docId);
  if (!doc) return;

  doc.status = decision;
  doc.reviewedAt = new Date().toISOString();
  doc.reviewedBy = currentUser.username;
  doc.comment = comment || null;

  saveDocuments(docs);
  closeModal('review-modal');
  renderStats();
  renderDocuments();
  showToast(`"${doc.title}" ${decision}`, decision === 'approved' ? 'success' : 'error');
}

// --- Utilities ---
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- Init ---
window.addEventListener('DOMContentLoaded', () => {
  const session = getSession();
  if (session) {
    currentUser = session;
    showApp();
  }
});
