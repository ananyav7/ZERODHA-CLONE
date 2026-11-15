export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.port === "3002"
    ? "http://localhost:3000"
    : "/api");

export const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL ||
  (typeof window !== "undefined" && window.location.port === "3002"
    ? "http://localhost:3001"
    : "/");
