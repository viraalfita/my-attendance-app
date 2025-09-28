<template>
  <div class="admin-layout">
    <div class="main-content">
      <main class="p-4">
        <div class="grid border-round-2xl border-1 surface-border p-4">
          <!-- Page Header -->
          <div class="col-12">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-cog text-2xl text-primary"></i>
              <h1 class="text-3xl font-bold m-0">Pengaturan Perusahaan</h1>
            </div>
          </div>

          <!-- Company Form -->
          <div class="col-12 lg:col-8">
            <div
              class="p-4 border-1 surface-border border-round-2xl surface-card"
            >
              <h2 class="text-xl font-semibold mb-4">Informasi Perusahaan</h2>
              <form
                @submit.prevent="updateCompanyData"
                class="flex flex-column gap-3"
              >
                <div class="field">
                  <label for="name" class="block text-900 font-medium mb-2"
                    >Nama Perusahaan</label
                  >
                  <InputText
                    id="name"
                    v-model="name"
                    placeholder="Masukkan nama perusahaan"
                    class="w-full"
                    required
                    :disabled="loading"
                  />
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
                    required
                    :disabled="loading"
                  />
                </div>

                <div class="grid">
                  <div class="col-12 md:col-6">
                    <label
                      for="time_start"
                      class="block text-900 font-medium mb-2"
                      >Jam Masuk</label
                    >
                    <Calendar
                      id="time_start"
                      v-model="time_start"
                      timeOnly
                      hourFormat="24"
                      placeholder="HH:MM"
                      class="w-full"
                      :disabled="loading"
                    />
                  </div>
                  <div class="col-12 md:col-6">
                    <label
                      for="time_end"
                      class="block text-900 font-medium mb-2"
                      >Jam Pulang</label
                    >
                    <Calendar
                      id="time_end"
                      v-model="time_end"
                      timeOnly
                      hourFormat="24"
                      placeholder="HH:MM"
                      class="w-full"
                      :disabled="loading"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  label="Simpan Perubahan"
                  icon="pi pi-check"
                  class="w-full mt-3"
                  :loading="loading"
                />
              </form>
            </div>
          </div>

          <!-- Company Info -->
          <div class="col-12 lg:col-4">
            <div
              class="p-4 border-1 surface-border border-round-2xl surface-card"
            >
              <h2 class="text-xl font-semibold mb-4">Informasi Sistem</h2>
              <div class="flex flex-column gap-3">
                <div class="flex align-items-center gap-3">
                  <i class="pi pi-id-card text-primary"></i>
                  <div>
                    <span class="block text-color-secondary text-sm"
                      >Kode Perusahaan</span
                    >
                    <span class="font-semibold">{{ companyCode }}</span>
                  </div>
                </div>
                <Divider />
                <div class="flex align-items-center gap-3">
                  <i class="pi pi-calendar text-primary"></i>
                  <div>
                    <span class="block text-color-secondary text-sm"
                      >Tanggal Bergabung</span
                    >
                    <span class="font-semibold">{{ joinDate }}</span>
                  </div>
                </div>
                <Divider />
                <div class="flex align-items-center gap-3">
                  <i class="pi pi-users text-primary"></i>
                  <div>
                    <span class="block text-color-secondary text-sm"
                      >Total Karyawan</span
                    >
                    <span class="font-semibold">{{ totalEmployees }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { getCompany, getUsersByCompany, updateCompany } from "../../api/api"; // ← tambah getUsersByCompany

import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Divider from "primevue/divider";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

export default {
  components: {
    InputText,
    Textarea,
    Calendar,
    Button,
    Divider,
  },
  setup() {
    const companyId = localStorage.getItem("companyId");
    const companyCode = localStorage.getItem("companyCode");

    const name = ref("");
    const address = ref("");
    const time_start = ref(null);
    const time_end = ref(null);

    const loading = ref(false);
    const joinDate = ref("-");
    const totalEmployees = ref(0);

    const hhmmToDate = (hhmm) => {
      if (!hhmm || typeof hhmm !== "string") return null;
      const [h, m] = hhmm.split(":").map(Number);
      const d = new Date();
      d.setHours(isNaN(h) ? 0 : h, isNaN(m) ? 0 : m, 0, 0);
      return d;
    };

    const dateToHHMM = (d) => {
      if (!(d instanceof Date)) return null;
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const fetchCompany = async () => {
      loading.value = true;
      try {
        const res = await getCompany(companyCode);
        const c = res?.data || {};

        name.value = c.name || "";
        address.value = c.address || "";
        time_start.value = hhmmToDate(c.timeStart);
        time_end.value = hhmmToDate(c.timeEnd);

        joinDate.value = c.createdAt
          ? new Date(c.createdAt).toLocaleDateString("id-ID")
          : "-";

        if (companyId) {
          const usersRes = await getUsersByCompany(companyId);
          const list = Array.isArray(usersRes?.data) ? usersRes.data : [];
          totalEmployees.value = list.filter(
            (u) => (u.role || "employee") === "employee"
          ).length;
        } else {
          totalEmployees.value = 0;
        }
      } catch (err) {
        alert(err?.response?.data?.error || "Gagal memuat data perusahaan");
      } finally {
        loading.value = false;
      }
    };

    const updateCompanyData = async () => {
      loading.value = true;
      try {
        await updateCompany(companyId, {
          name: name.value,
          address: address.value,
          time_start: dateToHHMM(time_start.value),
          time_end: dateToHHMM(time_end.value),
        });
        await fetchCompany();
      } catch (err) {
        alert(err?.response?.data?.error || "Terjadi kesalahan");
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchCompany);

    return {
      name,
      address,
      time_start,
      time_end,
      loading,
      companyCode,
      joinDate,
      totalEmployees,
      updateCompanyData,
    };
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.border-round-2xl {
  border-radius: 1.5rem;
}
.surface-card {
  background-color: #fff !important;
}
.surface-border {
  border-color: var(--surface-border);
}
</style>
