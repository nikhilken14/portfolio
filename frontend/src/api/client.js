// In dev we default to the local API; in production the URL must come from
// VITE_API_URL. Without one, backend features degrade gracefully (mailto).
const API_BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "")).replace(/\/$/, "");

export const hasApi = Boolean(API_BASE_URL);
export const RESUME_URL = `${API_BASE_URL}/api/resume`;

async function request(path, { method = "GET", body, timeout = 10000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal: ctrl.signal,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON body */
    }
    if (!res.ok) {
      const err = new Error("Request failed");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export const getResumeStatus = () => request("/api/resume/status", { timeout: 60000 });
// Render's free tier can take ~50s to wake, so the form allows a long timeout.
export const postContact = (payload) => request("/api/contact", { method: "POST", body: payload, timeout: 70000 });
