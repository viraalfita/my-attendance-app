<template>
  <div
    class="surface-ground min-h-screen flex align-items-center justify-content-center"
  >
    <Card class="w-full md:w-6 lg:w-4 shadow-5 border-round-xl">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-sign-in text-primary"></i>
          <span>Masuk ke Akun</span>
        </div>
      </template>

      <template #subtitle>
        Gunakan username, password, dan kode perusahaan Anda
      </template>

      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-column gap-3">
          <!-- Username -->
          <div class="field">
            <label for="username" class="block text-900 font-medium mb-2">
              Username
            </label>
            <InputText
              id="username"
              v-model.trim="username"
              type="text"
              placeholder="Masukkan username"
              class="w-full"
              :class="{ 'p-invalid': usernameError }"
              autocomplete="username"
              required
            />
            <small v-if="usernameError" class="p-error">{{
              usernameError
            }}</small>
          </div>

          <!-- Password -->
          <div class="field">
            <label for="password" class="block text-900 font-medium mb-2"
              >Password</label
            >
            <Password
              id="password"
              v-model="password"
              class="w-full"
              toggleMask
              :feedback="false"
              inputClass="w-full"
              :inputProps="{
                placeholder: '••••••••',
                autocomplete: 'current-password',
              }"
              :class="{ 'p-invalid': passwordError }"
              required
            />
            <small v-if="passwordError" class="p-error">{{
              passwordError
            }}</small>
          </div>

          <!-- Company Code -->
          <div class="field">
            <label for="companyCode" class="block text-900 font-medium mb-2">
              Company Code
            </label>
            <InputText
              id="companyCode"
              v-model.trim="companyCode"
              type="text"
              placeholder="Masukkan kode perusahaan"
              class="w-full"
              :class="{ 'p-invalid': companyCodeError }"
              required
            />
            <small v-if="companyCodeError" class="p-error">{{
              companyCodeError
            }}</small>
          </div>

          <!-- Remember me -->
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center gap-2">
              <Checkbox inputId="remember" v-model="remember" :binary="true" />
              <label for="remember">Ingat saya</label>
            </div>
          </div>

          <!-- Submit -->
          <Button
            type="submit"
            label="Masuk"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="w-full mt-2"
            :loading="loading"
          />

          <Divider />

          <div class="text-center text-600 text-sm">
            Belum punya perusahaan?
            <RouterLink
              to="/register-company"
              class="text-primary hover:underline"
            >
              Daftarkan di sini
            </RouterLink>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loginUser, setAuthToken } from "../../api/api";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    const username = ref("");
    const password = ref("");
    const companyCode = ref("");
    const remember = ref(true);

    const usernameError = ref("");
    const passwordError = ref("");
    const companyCodeError = ref("");
    const loading = ref(false);

    const validate = () => {
      usernameError.value = "";
      passwordError.value = "";
      companyCodeError.value = "";

      let ok = true;
      if (!username.value) {
        usernameError.value = "Username wajib diisi";
        ok = false;
      }
      if (!password.value) {
        passwordError.value = "Password wajib diisi";
        ok = false;
      }
      if (!companyCode.value) {
        companyCodeError.value = "Company code wajib diisi";
        ok = false;
      }
      return ok;
    };

    const persistAuth = (payload) => {
      const { token, role, company, working_hours } = payload;

      const store = remember.value ? localStorage : sessionStorage;
      store.setItem("token", token);
      store.setItem("role", role);
      store.setItem("company", JSON.stringify(company));
      store.setItem("working_hours", JSON.stringify(working_hours));

      // ⬇️ Tambahkan ini agar guard lama tetap bekerja
      store.setItem("user", JSON.stringify({ role }));
      setAuthToken(token);
    };

    const roleRedirect = (role) => {
      const redirect = route.query.redirect;
      if (redirect) return router.replace(String(redirect));
      if (role === "admin") return router.replace("/admin");
      return router.replace("/");
    };

    const onSubmit = async () => {
      if (!validate()) return;
      loading.value = true;
      try {
        const res = await loginUser({
          username: username.value,
          password: password.value,
          companyCode: companyCode.value,
        });
        persistAuth(res.data);
        roleRedirect(res.data.role);
      } catch (err) {
        const msg =
          err?.response?.data?.error ||
          "Username, password, atau company code salah";
        passwordError.value = msg;
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      companyCode,
      remember,
      usernameError,
      passwordError,
      companyCodeError,
      loading,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
