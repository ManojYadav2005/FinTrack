import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Axios instance
const api = axios.create({ baseURL: API_URL });

// Attach Clerk token to every request
// Call setAuthToken(token) from useAuth() in your component
let _token = null;
export function setAuthToken(token) {
  _token = token;
}

api.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

// ── Auth ─────────────────────────────────────────────────────
export const syncUser = () => api.post("/auth/sync").then((r) => r.data);

// ── Dashboard ────────────────────────────────────────────────
export const getUserAccounts = () => api.get("/dashboard/accounts").then((r) => r.data);
export const createAccount = (data) => api.post("/dashboard/accounts", data).then((r) => r.data);
export const getDashboardData = () => api.get("/dashboard/data").then((r) => r.data);

// ── Accounts ─────────────────────────────────────────────────
export const getAccountWithTransactions = (id) => api.get(`/accounts/${id}`).then((r) => r.data);
export const bulkDeleteTransactions = (transactionIds) => api.post("/accounts/bulk-delete", { transactionIds }).then((r) => r.data);
export const updateDefaultAccount = (accountId) => api.post("/accounts/default", { accountId }).then((r) => r.data);

// ── Budgets ──────────────────────────────────────────────────
export const getCurrentBudget = (accountId) => api.get("/budgets", { params: { accountId } }).then((r) => r.data);
export const updateBudget = (amount) => api.post("/budgets", { amount }).then((r) => r.data);

// ── Transactions ─────────────────────────────────────────────
export const createTransaction = (data) => api.post("/transactions", data).then((r) => r.data);
export const getTransaction = (id) => api.get(`/transactions/${id}`).then((r) => r.data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data).then((r) => r.data);
export const getUserTransactions = (params) => api.get("/transactions", { params }).then((r) => r.data);

export default api;
