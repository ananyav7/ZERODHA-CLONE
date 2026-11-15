export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.port === "3001"
    ? "http://localhost:3000"
    : "/api");

export const DASHBOARD_URL =
  process.env.REACT_APP_DASHBOARD_URL ||
  (typeof window !== "undefined" && window.location.port === "3001"
    ? "http://localhost:3002"
    : "/dashboard");
