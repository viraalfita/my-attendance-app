import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  const setUser = (userData) => {
    user.value = userData;
  };

  const logout = () => {
    user.value = null;
    // Clear localStorage atau cookie jika ada
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  const isAuthenticated = computed(() => {
    return user.value !== null;
  });

  return {
    user,
    setUser,
    logout,
    isAuthenticated,
  };
});
