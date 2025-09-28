<template>
  <div
    class="surface-ground min-h-screen flex align-items-center justify-content-center"
  >
    <Card class="w-full md:w-6 lg:w-4 shadow-5 border-round-xl">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-building text-primary"></i>
          <span>Daftarkan Perusahaan</span>
        </div>
      </template>
      <template #subtitle>
        Langkah 1 dari 2 - Informasi perusahaan Anda
      </template>
      <template #content>
        <form @submit.prevent="submitCompany" class="flex flex-column gap-3">
          <div class="field">
            <label for="name" class="block text-900 font-medium mb-2"
              >Nama Perusahaan</label
            >
            <InputText
              id="name"
              v-model="name"
              placeholder="Masukkan nama perusahaan"
              class="w-full"
              :class="{ 'p-invalid': nameError }"
              required
            />
            <small v-if="nameError" class="p-error">{{ nameError }}</small>
          </div>

          <div class="field">
            <label for="address" class="block text-900 font-medium mb-2"
              >Alamat</label
            >
            <Textarea
              id="address"
              v-model="address"
              placeholder="Masukkan alamat lengkap perusahaan"
              rows="3"
              class="w-full"
              :class="{ 'p-invalid': addressError }"
              required
            />
            <small v-if="addressError" class="p-error">{{
              addressError
            }}</small>
          </div>

          <div class="grid">
            <div class="col-12 md:col-6">
              <label for="time_start" class="block text-900 font-medium mb-2"
                >Jam Masuk</label
              >
              <Calendar
                id="time_start"
                v-model="time_start"
                timeOnly
                hourFormat="24"
                placeholder="HH:MM"
                class="w-full"
              />
            </div>
            <div class="col-12 md:col-6">
              <label for="time_end" class="block text-900 font-medium mb-2"
                >Jam Pulang</label
              >
              <Calendar
                id="time_end"
                v-model="time_end"
                timeOnly
                hourFormat="24"
                placeholder="HH:MM"
                class="w-full"
              />
            </div>
          </div>

          <Button
            type="submit"
            label="Selanjutnya"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="w-full mt-3"
            :loading="loading"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerCompany } from "../../api/api";

// PrimeVue Components
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

export default {
  components: {
    Card,
    InputText,
    Textarea,
    Calendar,
    Button,
  },
  setup() {
    const router = useRouter();
    const name = ref("");
    const address = ref("");
    const time_start = ref("");
    const time_end = ref("");
    const loading = ref(false);
    const nameError = ref("");
    const addressError = ref("");

    const validateForm = () => {
      let isValid = true;

      // Reset errors
      nameError.value = "";
      addressError.value = "";

      // Validate name
      if (!name.value.trim()) {
        nameError.value = "Nama perusahaan wajib diisi";
        isValid = false;
      }

      // Validate address
      if (!address.value.trim()) {
        addressError.value = "Alamat wajib diisi";
        isValid = false;
      }

      return isValid;
    };

    const submitCompany = async () => {
      if (!validateForm()) return;

      loading.value = true;

      try {
        const payload = {
          name: name.value.trim(),
          address: address.value.trim(),
          timeStart: time_start.value,
          timeEnd: time_end.value,
        };

        console.log("Data yang dikirim ke API:", payload);

        const res = await registerCompany(payload);

        localStorage.setItem("companyId", res.data.companyId);
        localStorage.setItem("companyCode", res.data.companyCode);
        router.push("/register-admin");
      } catch (err) {
        alert(
          err.response?.data?.error ||
            "Terjadi kesalahan saat mendaftarkan perusahaan"
        );
      } finally {
        loading.value = false;
      }
    };

    return {
      name,
      address,
      time_start,
      time_end,
      loading,
      nameError,
      addressError,
      submitCompany,
    };
  },
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
