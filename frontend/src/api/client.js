import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getProfile = () => client.get("/api/profile").then((r) => r.data);
export const getSkills = () => client.get("/api/skills").then((r) => r.data);
export const getProjects = () => client.get("/api/projects").then((r) => r.data);
export const getEducation = () => client.get("/api/education").then((r) => r.data);
export const getExperience = () => client.get("/api/experience").then((r) => r.data);
export const postContact = (payload) => client.post("/api/contact", payload).then((r) => r.data);
export const getResumeStatus = () => client.get("/api/resume/status").then((r) => r.data);

// Direct download URL — used as an <a href> target, not fetched via axios,
// so the browser handles the file download/save dialog itself.
export const RESUME_DOWNLOAD_URL = `${API_BASE_URL}/api/resume`;

export { API_BASE_URL };
export default client;