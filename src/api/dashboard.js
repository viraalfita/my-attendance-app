import axios from "axios";

const baseURL = "https://attendance-service-production-3488.up.railway.app/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ---- USERS ----
export const fetchUsersByCompany = async (companyId) => {
  const { data } = await api.get(`/users/company/${companyId}`);
  return Array.isArray(data) ? data : [];
};

// ---- ATTENDANCE ----
export const fetchAttendanceByCompany = async (companyId) => {
  const { data } = await api.get(`/attendance/company/${companyId}`);
  return Array.isArray(data) ? data : [];
};

export const fetchTodayAttendanceByCompany = async (
  companyId,
  tz = "Asia/Jakarta"
) => {
  const { data } = await api.get(`/attendance/company/${companyId}/today`, {
    params: { tz },
  });
  return Array.isArray(data) ? data : [];
};

// ---- LEAVES ----
export const fetchAllLeaves = async () => {
  const { data } = await api.get(`/leaves`);
  return Array.isArray(data) ? data : [];
};
