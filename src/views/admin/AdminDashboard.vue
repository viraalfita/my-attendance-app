<template>
  <div class="admin-dashboard-container">
    <AdminSidebar />

    <main class="main-content">
      <Navbar />
      <div class="content-body">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "../../components/Navbar.vue";
import AdminSidebar from "../../components/Sidebar.vue";

export default {
  name: "AdminDashboard",
  components: {
    AdminSidebar,
    Navbar,
  },
  setup() {
    const route = useRoute();

    const pageTitle = computed(() => {
      const routeName = route.name;
      const titleMap = {
        AdminDashboard: "Dashboard",
        UsersManagement: "User Management",
        AttendanceManagement: "Attendance Management",
        LeaveManagement: "Leave Management",
        CompanySettings: "Company Settings",
      };
      return titleMap[routeName] || "Admin Dashboard";
    });

    return {
      pageTitle,
    };
  },
};
</script>

<style scoped>
.admin-dashboard-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style>
