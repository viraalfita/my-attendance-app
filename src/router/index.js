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
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      breadcrumb: "Home",
      title: "Home | Attendance System",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      breadcrumb: "Login",
      requiresGuest: true,
      title: "Login | Attendance System",
    },
  },
  {
    path: "/register-company",
    name: "RegisterCompany",
    component: RegisterCompany,
    meta: {
      breadcrumb: "Register Company",
      requiresGuest: true,
      title: "Register Company | Attendance System",
    },
  },
  {
    path: "/register-admin",
    name: "RegisterAdmin",
    component: RegisterAdmin,
    meta: {
      breadcrumb: "Register Admin",
      requiresGuest: true,
      title: "Register Admin | Attendance System",
    },
  },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: {
      breadcrumb: "Admin",
      requiresAuth: true,
      roles: ["admin"],
      title: "Admin Dashboard | Attendance System",
    },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: DashboardContent,
        meta: {
          breadcrumb: "Dashboard",
          title: "Dashboard | Attendance System",
        },
      },
      {
        path: "users",
        name: "UsersManagement",
        component: UsersManagement,
        meta: {
          breadcrumb: "User Management",
          title: "User Management | Attendance System",
        },
      },
      {
        path: "attendance",
        name: "AttendanceManagement",
        component: AttendanceManagement,
        meta: {
          breadcrumb: "Attendance Management",
          title: "Attendance | Attendance System",
        },
      },
      {
        path: "leave",
        name: "LeaveManagement",
        component: LeaveManagement,
        meta: {
          breadcrumb: "Leave Management",
          title: "Leave | Attendance System",
        },
      },
      {
        path: "company",
        name: "CompanySettings",
        component: CompanySettings,
        meta: {
          breadcrumb: "Company Settings",
          title: "Company Settings | Attendance System",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===== Auth Guards =====
function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}
function getRole() {
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
    return next(role === "admin" ? "/admin" : "/");
  }

  next();
});

// ===== Dynamic Page Title =====
router.afterEach((to) => {
  const defaultTitle = "Attendance System";
  document.title = to.meta?.title || defaultTitle;
});

export default router;
