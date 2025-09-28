<template>
  <div
    class="surface-ground min-h-screen flex align-items-center justify-content-center"
  >
    <Card class="w-full md:w-6 lg:w-4 shadow-5 border-round-xl">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-primary"></i>
          <span>Daftarkan Admin</span>
        </div>
      </template>

      <template #subtitle> Langkah 2 dari 2 - Buat akun admin Anda </template>

      <template #content>
        <form @submit.prevent="submitAdmin" class="flex flex-column gap-3">
          <div class="field">
            <label for="username" class="block text-900 font-medium mb-2"
              >Username</label
            >
            <InputText
              id="username"
              v-model="username"
              placeholder="Masukkan username admin"
              class="w-full"
              :class="{ 'p-invalid': usernameError }"
              autocomplete="username"
              required
            />
            <small v-if="usernameError" class="p-error">{{
              usernameError
            }}</small>
          </div>

          <div class="field">
            <label for="password" class="block text-900 font-medium mb-2"
              >Password</label
            >
            <InputText
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Masukkan password"
              class="w-full"
              :class="{ 'p-invalid': passwordError }"
              autocomplete="new-password"
              required
            />
            <div class="flex align-items-center gap-2 mt-2">
              <Checkbox
                v-model="showPassword"
                :binary="true"
                inputId="showpass"
              />
              <label for="showpass">Tampilkan password</label>
            </div>
            <small v-if="passwordError" class="p-error">{{
              passwordError
            }}</small>
          </div>

          <Button
            type="submit"
            label="Selesaikan Setup"
            icon="pi pi-check"
            class="w-full mt-3"
            :loading="loading"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { nextTick, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser, registerAdmin } from "../../api/api";
import { useUserStore } from "../../store/user";

// PrimeVue Components (samakan gaya dengan register company)
import Button from "primevue/button";
import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";

export default {
  components: {
    Card,
    InputText,
    Button,
    Checkbox,
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    const username = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    const usernameError = ref("");
    const passwordError = ref("");

    const isMounted = ref(true);
    onUnmounted(() => {
      isMounted.value = false;
    });

    const validateForm = () => {
      let isValid = true;
      usernameError.value = "";
      passwordError.value = "";

      if (!username.value.trim()) {
        usernameError.value = "Username wajib diisi";
        isValid = false;
      }

      if (!password.value) {
        passwordError.value = "Password wajib diisi";
        isValid = false;
      } else if (password.value.length < 6) {
        passwordError.value = "Password minimal 6 karakter";
        isValid = false;
      }

      return isValid;
    };

    const submitAdmin = async () => {
      if (!validateForm()) return;

      loading.value = true;
      try {
        const companyCode = localStorage.getItem("companyCode");

        // Register admin
        await registerAdmin({
          username: username.value.trim(),
          password: password.value,
          companyCode,
        });

        // Auto login
        const res = await loginUser({
          username: username.value.trim(),
          password: password.value,
          companyCode,
        });

        if (!isMounted.value) return;

        // Simpan user ke store + persist companyId agar konsisten dengan langkah 1
        userStore.setUser(res.data);
        if (res?.data?.company?.id) {
          localStorage.setItem("companyId", res.data.company.id);
        }

        await nextTick();
        router.push("/admin");
      } catch (err) {
        if (!isMounted.value) return;
        alert(
          err?.response?.data?.error ||
            err?.message ||
            "Terjadi kesalahan saat mendaftarkan admin"
        );
      } finally {
        if (isMounted.value) loading.value = false;
      }
    };

    return {
      username,
      password,
      showPassword,
      loading,
      usernameError,
      passwordError,
      submitAdmin,
    };
  },
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
