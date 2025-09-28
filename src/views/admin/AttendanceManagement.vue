<template>
  <div class="admin-layout">
    <div class="main-content">
      <main class="p-4">
        <div class="grid border-round-2xl border-1 surface-border p-4">
          <!-- Header -->
          <div class="col-12">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-calendar text-2xl text-primary"></i>
              <h1 class="text-3xl font-bold m-0">Manajemen Absensi</h1>
            </div>
          </div>

          <!-- Filter -->
          <div class="col-12">
            <div
              class="p-4 border-1 surface-border border-round-2xl surface-card"
            >
              <div
                class="flex flex-wrap align-items-end gap-3 justify-content-between"
              >
                <div class="flex flex-wrap gap-3">
                  <div>
                    <label class="block text-900 font-medium mb-2"
                      >Tanggal Mulai</label
                    >
                    <Calendar
                      v-model="startDate"
                      dateOnly
                      showIcon
                      class="w-full md:w-14rem"
                      :maxDate="endDate || null"
                    />
                  </div>
                  <div>
                    <label class="block text-900 font-medium mb-2"
                      >Tanggal Akhir</label
                    >
                    <Calendar
                      v-model="endDate"
                      dateOnly
                      showIcon
                      class="w-full md:w-14rem"
                      :minDate="startDate || null"
                    />
                  </div>
                  <div>
                    <label class="block text-900 font-medium mb-2"
                      >Karyawan</label
                    >
                    <Dropdown
                      v-model="selectedUser"
                      :options="userOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Pilih Karyawan"
                      showClear
                      class="w-full md:w-14rem"
                    />
                  </div>
                </div>

                <div class="flex gap-2">
                  <Button
                    label="Filter"
                    icon="pi pi-filter"
                    class="w-full md:w-auto"
                    @click="applyFilter"
                  />
                  <Button
                    label="Reset"
                    icon="pi pi-refresh"
                    severity="secondary"
                    outlined
                    class="w-full md:w-auto"
                    @click="resetFilter"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Tabel -->
          <div class="col-12">
            <div
              class="p-4 border-1 surface-border border-round-2xl surface-card"
            >
              <div class="flex align-items-center justify-content-between mb-4">
                <span class="text-xl font-semibold">
                  Data Absensi
                  <span class="text-600 text-sm ml-2">
                    ({{ filteredAttendance.length }} baris)
                  </span>
                </span>
                <Button
                  label="Ekspor Excel"
                  icon="pi pi-file-excel"
                  severity="success"
                  outlined
                  @click="exportExcel"
                  :disabled="loading || !filteredAttendance.length"
                />
              </div>

              <DataTable
                :value="filteredAttendance"
                :paginator="true"
                :rows="10"
                :loading="loading"
                :rowsPerPageOptions="[10, 20, 50]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
              >
                <Column header="Karyawan" sortable>
                  <template #body="{ data }">
                    {{ getUsername(data) }}
                  </template>
                </Column>

                <Column field="type" header="Tipe" sortable>
                  <template #body="{ data }">
                    <Tag
                      :value="(data.type || '-').toUpperCase()"
                      :severity="
                        data.type === 'checkin' ? 'success' : 'warning'
                      "
                    />
                  </template>
                </Column>

                <Column header="Waktu" sortable>
                  <template #body="{ data }">
                    {{ formatDate(getTimestamp(data)) }}
                  </template>
                </Column>

                <Column header="Status" sortable>
                  <template #body="{ data }">
                    <Tag
                      :value="data.status || (data.late ? 'Late' : 'On time')"
                      severity="info"
                    />
                  </template>
                </Column>

                <Column header="Aksi">
                  <template #body="{ data }">
                    <Button
                      icon="pi pi-eye"
                      text
                      rounded
                      severity="info"
                      @click="viewDetails(data)"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { getAllAttendanceByCompany, getUsersByCompany } from "../../api/api";

// PrimeVue
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";

export default {
  components: {
    DataTable,
    Column,
    Tag,
    Button,
    Calendar,
    Dropdown,
  },
  setup() {
    const companyId = localStorage.getItem("companyId");

    // state
    const loading = ref(false);
    const attendance = ref([]); // raw data
    const users = ref([]); // raw users

    // filter state
    const startDate = ref(null); // Date
    const endDate = ref(null); // Date
    const selectedUser = ref(null); // userId string

    // options dropdown user
    const userOptions = computed(() =>
      (users.value || []).map((u) => ({
        label: u.username || u.name || "(tanpa nama)",
        value: String(u._id || u.id),
      }))
    );

    // helpers baca username & timestamp berbagai bentuk payload
    const getUsername = (r) =>
      r?.user?.username || r?.userId?.username || r?.username || "(tanpa nama)";

    const getUserId = (r) =>
      String(r?.userId?._id || r?.user?._id || r?.userId || r?.user || "");

    const getTimestamp = (r) =>
      r?.timestamp || r?.time || r?.createdAt || r?.updatedAt || null;

    // fetch data
    const fetchAll = async () => {
      loading.value = true;
      try {
        const [attRes, usersRes] = await Promise.all([
          getAllAttendanceByCompany(companyId), // kalau wrapper-mu tidak butuh argumen, hapus companyId
          getUsersByCompany(companyId),
        ]);

        attendance.value = Array.isArray(attRes?.data) ? attRes.data : [];
        users.value = Array.isArray(usersRes?.data) ? usersRes.data : [];
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        loading.value = false;
      }
    };

    // filter logic (computed)
    const filteredAttendance = computed(() => {
      const list = attendance.value || [];

      // normalisasi batas tanggal (inclusive)
      // start = 00:00:00, end = 23:59:59.999 (zona waktu browser)
      let startMs = null;
      let endMs = null;

      if (startDate.value instanceof Date && !isNaN(startDate.value)) {
        const s = new Date(startDate.value);
        s.setHours(0, 0, 0, 0);
        startMs = s.getTime();
      }
      if (endDate.value instanceof Date && !isNaN(endDate.value)) {
        const e = new Date(endDate.value);
        e.setHours(23, 59, 59, 999);
        endMs = e.getTime();
      }

      return list.filter((r) => {
        // filter user
        if (selectedUser.value) {
          if (getUserId(r) !== String(selectedUser.value)) {
            return false;
          }
        }

        // filter tanggal
        const ts = getTimestamp(r);
        if (!ts) return false;
        const t = new Date(ts).getTime();
        if (Number.isNaN(t)) return false;

        if (startMs !== null && t < startMs) return false;
        if (endMs !== null && t > endMs) return false;

        return true;
      });
    });

    const applyFilter = () => {};

    const resetFilter = () => {
      startDate.value = null;
      endDate.value = null;
      selectedUser.value = null;
    };

    // format tampilan tanggal
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      try {
        return new Date(dateString).toLocaleString("id-ID");
      } catch {
        return dateString;
      }
    };

    const viewDetails = (row) => {
      console.log("View details:", row);
    };

    // === EXPORT EXCEL (mengikuti data terfilter) ===
    const exportExcel = async () => {
      try {
        if (!filteredAttendance.value.length) {
          alert("Tidak ada data untuk diekspor.");
          return;
        }

        const XLSX = await import("xlsx");

        const rows = filteredAttendance.value.map((r, idx) => {
          const username = getUsername(r);
          const ts = getTimestamp(r);

          return {
            No: idx + 1,
            Karyawan: username,
            Tipe: (r?.type || "-").toUpperCase(),
            Waktu: formatDate(ts),
            Status: r?.status || (r?.late ? "Late" : "On time"),
            Late: r?.late ? "Ya" : "Tidak",
            Latitude: r?.location?.latitude ?? "",
            Longitude: r?.location?.longitude ?? "",
          };
        });

        const ws = XLSX.utils.json_to_sheet(rows);

        // Auto width
        const headers = Object.keys(rows[0] || { No: "" });
        ws["!cols"] = headers.map((key) => {
          const maxLen = rows.reduce((acc, row) => {
            const val = row[key] != null ? String(row[key]) : "";
            return Math.max(acc, val.length);
          }, key.length);
          return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Absensi");

        // Nama file dinamis (ikut filter)
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        let suffix = `${yyyy}-${mm}-${dd}`;

        if (startDate.value || endDate.value) {
          const s = startDate.value ? new Date(startDate.value) : null;
          const e = endDate.value ? new Date(endDate.value) : null;

          const fmt = (d) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(d.getDate()).padStart(2, "0")}`;

          const sStr = s ? fmt(s) : "ALL";
          const eStr = e ? fmt(e) : "ALL";
          suffix = `${sStr}_to_${eStr}`;
        }

        XLSX.writeFile(wb, `absensi_${suffix}.xlsx`);
      } catch (err) {
        console.error("Gagal ekspor Excel:", err);
        alert("Gagal ekspor Excel.");
      }
    };

    onMounted(fetchAll);

    return {
      // state
      loading,
      attendance,
      users,

      // filter
      startDate,
      endDate,
      selectedUser,
      userOptions,
      applyFilter,
      resetFilter,

      // computed data
      filteredAttendance,

      // helpers
      getUsername,
      getTimestamp,
      formatDate,
      viewDetails,

      // export
      exportExcel,
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
  background-color: var(--surface-card);
}
.surface-border {
  border-color: var(--surface-border);
}
</style>
