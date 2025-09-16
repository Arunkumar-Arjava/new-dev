import { apiClient, supabase } from './apiConnection';

// Authentication APIs (Supabase)
export const authApis = {
  signUp: (email, password, metadata) => supabase.auth.signUp({ email, password, options: { data: metadata } }),
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  getUser: () => supabase.auth.getUser(),
  resetPassword: (email) => supabase.auth.resetPasswordForEmail(email),
  updatePassword: (password) => supabase.auth.updateUser({ password }),
};

// School APIs
export const schoolApis = {
  getSchool: () => apiClient.get('/school'),
  updateSchool: (data) => apiClient.put('/school', data),
};

// User Profile APIs
export const profileApis = {
  getProfiles: (params) => apiClient.get('/profiles', { params }),
  getProfile: (id) => apiClient.get(`/profiles/${id}`),
  updateProfile: (id, data) => apiClient.patch(`/profiles/${id}`, data),
  updateRole: (id, data) => apiClient.patch(`/profiles/${id}/role`, data),
  updateStatus: (id, data) => apiClient.patch(`/profiles/${id}/status`, data),
  getAuthStatus: (id) => apiClient.get(`/profiles/${id}/auth-status`),
};

// Invitation APIs
export const inviteApis = {
  createInvite: (data) => apiClient.post('/invites', data),
  getInvites: (params) => apiClient.get('/invites', { params }),
};

// Children APIs
export const childrenApis = {
  getChildren: (params) => apiClient.get('/children', { params }),
  getChild: (id) => apiClient.get(`/children/${id}`),
  createChild: (data) => apiClient.post('/children', data),
  updateChild: (id, data) => apiClient.patch(`/children/${id}`, data),
  deleteChild: (id) => apiClient.delete(`/children/${id}`),
};

// Classroom APIs
export const classroomApis = {
  getClassrooms: () => apiClient.get('/classrooms'),
  getClassroom: (id) => apiClient.get(`/classrooms/${id}`),
  createClassroom: (data) => apiClient.post('/classrooms', data),
  updateClassroom: (id, data) => apiClient.patch(`/classrooms/${id}`, data),
  getFormOverrides: (id) => apiClient.get(`/classrooms/${id}/form-overrides`),
  createFormOverride: (id, data) => apiClient.post(`/classrooms/${id}/form-overrides`, data),
};

// Enrollment APIs
export const enrollmentApis = {
  getEnrollments: (params) => apiClient.get('/enrollments', { params }),
  getEnrollment: (id) => apiClient.get(`/enrollments/${id}`),
  createEnrollment: (data) => apiClient.post('/enrollments', data),
  updateEnrollment: (id, data) => apiClient.patch(`/enrollments/${id}`, data),
  approveEnrollment: (id, data) => apiClient.post(`/enrollments/${id}/approve`, data),
  rejectEnrollment: (id, data) => apiClient.post(`/enrollments/${id}/reject`, data),
  requestRevision: (id, data) => apiClient.post(`/enrollments/${id}/request-revision`, data),
  getApprovalStatus: (id) => apiClient.get(`/enrollments/${id}/approval-status`),
  getApprovalHistory: (id) => apiClient.get(`/enrollments/${id}/approval-history`),
  getFormLockStatus: (id) => apiClient.get(`/enrollments/${id}/forms/lock-status`),
};

// Form Template APIs
export const formTemplateApis = {
  getFormTemplates: (params) => apiClient.get('/form-templates', { params }),
  getFormTemplate: (id) => apiClient.get(`/form-templates/${id}`),
  createFormTemplate: (data) => apiClient.post('/form-templates', data),
  updateFormTemplate: (id, data) => apiClient.patch(`/form-templates/${id}`, data),
  deleteFormTemplate: (id) => apiClient.delete(`/form-templates/${id}`),
  getFormStats: (id) => apiClient.get(`/form-templates/${id}/stats`),
};

// Form Assignment APIs
export const formAssignmentApis = {
  getFormAssignments: (enrollmentId, params) => apiClient.get(`/enrollments/${enrollmentId}/form-assignments`, { params }),
  getFormAssignment: (id) => apiClient.get(`/form-assignments/${id}`),
  createFormAssignment: (enrollmentId, data) => apiClient.post(`/enrollments/${enrollmentId}/form-assignments`, data),
  updateFormAssignment: (id, data) => apiClient.patch(`/form-assignments/${id}`, data),
  deleteFormAssignment: (id) => apiClient.delete(`/form-assignments/${id}`),
};

// Form Submission APIs
export const formSubmissionApis = {
  getFormSubmissions: (params) => apiClient.get('/form-submissions', { params }),
  getFormSubmission: (id) => apiClient.get(`/form-submissions/${id}`),
  processWebhook: (data) => apiClient.post('/webhooks/fillout', data),
};

// Document APIs
export const documentApis = {
  getDocuments: (enrollmentId, params) => apiClient.get(`/enrollments/${enrollmentId}/documents`, { params }),
  uploadDocument: (enrollmentId, formData) => apiClient.post(`/enrollments/${enrollmentId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadDocument: (id) => apiClient.get(`/documents/${id}/download`, { responseType: 'blob' }),
  verifyDocument: (id, data) => apiClient.patch(`/documents/${id}/verify`, data),
  deleteDocument: (id) => apiClient.delete(`/documents/${id}`),
};

// Parent Additional Emails APIs
export const parentEmailApis = {
  getAdditionalEmails: (parentId) => apiClient.get(`/parents/${parentId}/additional-emails`),
  addAdditionalEmail: (parentId, data) => apiClient.post(`/parents/${parentId}/additional-emails`, data),
  updateAdditionalEmail: (id, data) => apiClient.patch(`/additional-emails/${id}`, data),
  deleteAdditionalEmail: (id) => apiClient.delete(`/additional-emails/${id}`),
  getNotificationEmails: (parentId) => apiClient.get(`/parents/${parentId}/notification-emails`),
};

// Notification APIs
export const notificationApis = {
  sendEmail: (data) => apiClient.post('/notifications/email', data),
  sendEnrollmentReminder: (data) => apiClient.post('/notifications/enrollment-reminder', data),
  getNotifications: (params) => apiClient.get('/notifications', { params }),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
};

// Communication Template APIs
export const templateApis = {
  getTemplates: (params) => apiClient.get('/communication/templates', { params }),
  getTemplate: (id) => apiClient.get(`/communication/templates/${id}`),
  createTemplate: (data) => apiClient.post('/communication/templates', data),
  updateTemplate: (id, data) => apiClient.patch(`/communication/templates/${id}`, data),
  deleteTemplate: (id) => apiClient.delete(`/communication/templates/${id}`),
};

// Admin Dashboard APIs
export const adminApis = {
  getDashboard: () => apiClient.get('/admin/dashboard/overview'),
  getEnrollmentMetrics: (params) => apiClient.get('/admin/analytics/enrollments', { params }),
  getFormAnalytics: (params) => apiClient.get('/admin/analytics/forms', { params }),
  getApprovalStatistics: (params) => apiClient.get('/admin/approval-statistics', { params }),
  getPendingApprovals: (params) => apiClient.get('/admin/enrollments/pending-approval', { params }),
  generateReport: (data) => apiClient.post('/admin/reports/enrollments', data),
  getReport: (id) => apiClient.get(`/admin/reports/${id}`),
  exportContacts: (params) => apiClient.get('/admin/exports/parent-contacts', { params }),
  getAuditLog: (params) => apiClient.get('/admin/audit-log', { params }),
  getDataRetention: () => apiClient.get('/admin/compliance/data-retention'),
};

// User Context APIs
export const userContextApis = {
  getSchoolContext: () => apiClient.get('/me/school'),
  updateMyProfile: (data) => apiClient.patch('/me/profile', data),
};