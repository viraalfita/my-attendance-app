<template>
  <aside
    class="h-screen p-2 surface-ground border-right-1 surface-border admin-sidebar"
    :class="isDark ? 'text-white' : 'text-900'"
  >
    <div class="flex flex-column h-full">
      <!-- Logo Section -->
      <div
        class="flex align-items-center gap-2 p-4 border-bottom-1 surface-border"
      >
        <!-- Hapus text-primary agar ikut warna mode -->
        <i class="pi pi-calendar-check text-xl"></i>
        <span class="font-semibold text-lg" :class="isDark ? 'text-white' : ''"
          >Smart Attendance</span
        >
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 flex flex-column p-3 gap-2">
        <Button
          v-for="item in menuItems"
          :key="item.route"
          @click="$router.push(item.route)"
          :label="item.label"
          :icon="item.icon"
          iconPos="start"
          text
          class="w-full justify-content-start p-3 border-round-lg"
          :class="[
            isActive(item.route)
              ? 'bg-primary text-white'
              : isDark
              ? 'text-white'
              : 'text-900',
          ]"
        />
      </nav>

      <!-- User Info & Logout -->
      <div class="p-3 border-top-1 surface-border">
        <div class="flex align-items-center gap-2 mb-3">
          <Avatar :label="userInitials" shape="circle" />
          <div class="flex flex-column">
            <span class="font-medium text-sm">{{ userName }}</span>
            <span class="text-color-secondary text-xs">Administrator</span>
          </div>
        </div>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          severity="danger"
          text
          class="w-full justify-content-start p-3 border-round-lg"
          @click="logout"
        />
      </div>
    </div>
  </aside>
</template>

<script>
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../store/user";

export default {
  name: "AdminSidebar",
  components: { Button, Avatar },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();

    const menuItems = [
      { label: "Dashboard", icon: "pi pi-home", route: "/admin" },
      { label: "User Management", icon: "pi pi-users", route: "/admin/users" },
      {
        label: "Attendance",
        icon: "pi pi-calendar",
        route: "/admin/attendance",
      },
      { label: "Leave", icon: "pi pi-clock", route: "/admin/leave" },
      { label: "Company Settings", icon: "pi pi-cog", route: "/admin/company" },
    ];

    const isActive = (r) =>
      route.path === r ||
      (route.path === "/admin" && r === "/admin") ||
      (route.path.startsWith("/admin/") && route.path === r);

    const isDark = ref(document.documentElement.classList.contains("dark"));
    const updateIsDark = () => {
      isDark.value = document.documentElement.classList.contains("dark");
    };

    // ADDED: simpan observer ke variabel agar bisa di-disconnect
    let mo = null;

    onMounted(() => {
      mo = new MutationObserver(updateIsDark);
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // ADDED: tambah padding ke body agar konten tidak ketiban sidebar fixed
      document.body.classList.add("has-admin-sidebar");
    });

    onBeforeUnmount(() => {
      // Hapus class padding saat komponen dilepas
      document.body.classList.remove("has-admin-sidebar");
      mo && mo.disconnect();
    });

    const userName = computed(() => userStore.user?.username || "Admin");
    const userInitials = computed(() =>
      userName.value
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    );

    const logout = () => {
      userStore.logout();
      router.push("/");
    };

    return {
      menuItems,
      userName,
      userInitials,
      logout,
      isActive,
      isDark,
    };
  },
};
</script>

<style scoped>
/* default komponen */
.h-screen {
  height: 100vh;
}
aside {
  width: 280px;
  transition: width 0.3s ease;
}

/* ADDED: fixed sidebar + scroll sendiri */
.admin-sidebar {
  position: fixed; /* kunci di layar */
  top: 0;
  left: 0;
  height: 100vh; /* penuh tinggi layar */
  overflow-y: auto; /* biar sidebar bisa scroll sendiri */
  z-index: 1000; /* di atas konten biasa */
}
</style>

<!-- ADDED: global style untuk memberi ruang ke konten utama -->
<style>
.has-admin-sidebar {
  padding-left: 280px; /* sinkron dengan lebar sidebar */
}

/* Responsif: pada layar kecil, biar tidak menekan konten */
@media (max-width: 992px) {
  .has-admin-sidebar {
    padding-left: 0;
  }
  /* Opsi: pada layar kecil, bisa ubah sidebar jadi overlay */
  .admin-sidebar {
    position: fixed;
    transform: translateX(0); /* bisa diubah ke -100% jika ingin toggle */
  }
}
</style>
