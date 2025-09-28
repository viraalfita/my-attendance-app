// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import Home from "../Home.vue";
import RegisterAdmin from "../views/admin/RegisterAdmin.vue";
import RegisterCompany from "../views/admin/RegisterCompany.vue";
import Login from "../views/auth/Login.vue";

// Admin pages
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AttendanceManagement from "../views/admin/AttendanceManagement.vue";
import CompanySettings from "../views/admin/CompanySettings.vue";
import DashboardContent from "../views/admin/DashboardContent.vue";
import LeaveManagement from "../views/admin/LeaveManagement.vue";
import UsersManagement from "../views/admin/UsersManagement.vue";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { breadcrumb: "Home" } },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { breadcrumb: "Login", requiresGuest: true },
  },
  {
    path: "/register-company",
    name: "RegisterCompany",
    component: RegisterCompany,
    meta: { breadcrumb: "Register Company", requiresGuest: true },
  },
  {
    path: "/register-admin",
    name: "RegisterAdmin",
    component: RegisterAdmin,
    meta: { breadcrumb: "Register Admin", requiresGuest: true },
  },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { breadcrumb: "Admin", requiresAuth: true, roles: ["admin"] },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: DashboardContent,
        meta: { breadcrumb: "Dashboard" },
      },
      {
        path: "users",
        name: "UsersManagement",
        component: UsersManagement,
        meta: { breadcrumb: "User Management" },
      },
      {
        path: "attendance",
        name: "AttendanceManagement",
        component: AttendanceManagement,
        meta: { breadcrumb: "Attendance Management" },
      },
      {
        path: "leave",
        name: "LeaveManagement",
        component: LeaveManagement,
        meta: { breadcrumb: "Leave Management" },
      },
      {
        path: "company",
        name: "CompanySettings",
        component: CompanySettings,
        meta: { breadcrumb: "Company Settings" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===== Auth Guards (opsional tapi direkomendasikan) =====
function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}
function getRole() {
  // coba ambil dari 'user.role' dulu, jatuh ke 'role' kalau perlu
  try {
    const u = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "null"
    );
    if (u?.role) return u.role;
  } catch {}
  return localStorage.getItem("role") || sessionStorage.getItem("role") || null;
}

router.beforeEach((to, from, next) => {
  const token = getToken();
  const role = getRole();

  if (to.meta?.requiresAuth && !token) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  if (to.meta?.roles?.length) {
    if (!role || !to.meta.roles.includes(role)) {
      return next({ path: "/" });
    }
  }

  if (to.meta?.requiresGuest && token) {
    // arahkan ke dashboard sesuai role
    return next(role === "admin" ? "/admin" : "/");
  }

  next();
});

export default router;
