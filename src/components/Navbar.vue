<template>
  <nav
    class="surface-card border-bottom-1 surface-border p-3 flex align-items-center justify-content-between"
  >
    <!-- Breadcrumb -->
    <div class="flex align-items-center gap-3">
      <ul
        class="flex items-center space-x-2 text-sm"
        :class="isDark ? 'text-white' : 'text-600'"
      >
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          class="flex items-center"
        >
          <RouterLink
            :to="crumb.to"
            class="hover:underline"
            :class="
              isDark
                ? 'text-white hover:text-gray-300'
                : 'text-600 hover:text-gray-800'
            "
          >
            {{ crumb.label }}
          </RouterLink>
          <span
            v-if="index < breadcrumbs.length - 1"
            class="mx-2"
            :class="isDark ? 'text-white' : 'text-600'"
            >/</span
          >
        </li>
      </ul>
    </div>

    <!-- User Menu -->
    <div class="flex align-items-center gap-3">
      <!-- Toggle Dark/Light Theme -->
      <Button
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        text
        rounded
        severity="secondary"
        aria-label="Toggle Theme"
        @click="toggleTheme"
      />

      <Menu ref="menu" :model="menuItems" :popup="true" />
      <Button
        @click="toggleMenu"
        :label="userName"
        icon="pi pi-user"
        text
        class="font-medium"
      >
        <i class="pi pi-chevron-down ml-2"></i>
      </Button>
    </div>
  </nav>
</template>

<script>
import { computed, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useUserStore } from "../store/user";

// PrimeVue Components
import Button from "primevue/button";
import Menu from "primevue/menu";
import Tag from "primevue/tag";

export default {
  components: {
    Button,
    Menu,
    Tag,
    RouterLink,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const menu = ref();

    const isDark = ref(localStorage.getItem("theme") === "dark");

    const applyTheme = () => {
      const root = document.documentElement;
      if (isDark.value) {
        root.classList.add("my-app-dark");
      } else {
        root.classList.remove("my-app-dark");
      }
    };

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      localStorage.setItem("theme", isDark.value ? "dark" : "light");
      applyTheme();
    };

    applyTheme();

    // Breadcrumb generator
    const breadcrumbs = computed(() =>
      route.matched.map((r) => ({
        label: r.meta?.breadcrumb || r.name,
        to: r.path,
      }))
    );

    const userName = computed(() => {
      return userStore.user?.username || "Admin";
    });

    const userRole = computed(() => {
      return userStore.user?.role === "admin" ? "Administrator" : "User";
    });

    const menuItems = ref([
      {
        label: "Profile",
        icon: "pi pi-user",
        command: () => {
          console.log("Navigate to profile");
        },
      },
      {
        label: "Settings",
        icon: "pi pi-cog",
        command: () => {
          router.push("/admin/company");
        },
      },
      {
        separator: true,
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: () => {
          userStore.logout();
          router.push("/");
        },
      },
    ]);

    const toggleMenu = (event) => {
      menu.value.toggle(event);
    };

    return {
      breadcrumbs,
      userName,
      userRole,
      menuItems,
      menu,
      toggleMenu,
      isDark,
      toggleTheme,
    };
  },
};
</script>
