import axios from "axios";

const API_URL = "https://attendance-service-production-3488.up.railway.app/api";

export const api = axios.create({ baseURL: API_URL });

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

const bootToken = localStorage.getItem("token");
if (bootToken) setAuthToken(bootToken);

export const registerCompany = (data) => api.post("/companies/register", data);
export const updateCompany = (id, data) => api.patch(`/companies/${id}`, data);
export const getCompany = (id) => api.get(`/companies/${id}`);
export const registerAdmin = (data) => api.post("/users/register/admin", data);
export const registerEmployee = (data) =>
  api.post("/users/register/employee", data);
export const loginUser = (data) => api.post("/users/login", data);
export const getUsersByCompany = (companyId) =>
  api.get(`/users/company/${companyId}`);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getAllAttendance = () => api.get("/attendance");
export const getAllAttendanceByCompany = (companyId) =>
  api.get(`/attendance/company/${companyId}`);
export const getAttendanceByUser = (userId) => api.get(`/attendance/${userId}`);
export const getAllLeaves = () => api.get("/leaves");
export const updateLeaveStatus = (id, status) =>
  api.patch(`/leaves/${id}/status`, { status });
export const cancelLeave = (id) => api.delete(`/leaves/${id}`);

export async function logout(router) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  try {
    const { setAuthToken } = await import("../api/api");
    setAuthToken(null);
  } catch {}
  if (router) router.replace("/login");
}
