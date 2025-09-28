<template>
  <div class="admin-layout">
    <div class="main-content">
      <main class="p-4">
        <div class="grid border-round-2xl border-1 surface-border p-4">
          <!-- Page Header -->
          <div class="col-12">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-briefcase text-2xl text-primary"></i>
              <h1 class="text-3xl font-bold m-0">Manajemen Cuti</h1>
            </div>
          </div>

          <!-- Filters -->
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
                      v-model="filterStart"
                      dateOnly
                      showIcon
                      class="w-full md:w-14rem"
                    />
                  </div>
                  <div>
                    <label class="block text-900 font-medium mb-2"
                      >Tanggal Akhir</label
                    >
                    <Calendar
                      v-model="filterEnd"
                      dateOnly
                      showIcon
                      class="w-full md:w-14rem"
                    />
                  </div>
                  <div>
                    <label class="block text-900 font-medium mb-2"
                      >Karyawan</label
                    >
                    <Dropdown
                      v-model="filterUser"
                      :options="userOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Semua Karyawan"
                      class="w-full md:w-14rem"
                      showClear
                    />
                  </div>
                  <div>
                    <label class="block text-900 font-medium mb-2"
                      >Status</label
                    >
                    <Dropdown
                      v-model="filterStatus"
                      :options="statusOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Semua Status"
                      class="w-full md:w-14rem"
                      showClear
                    />
                  </div>
                </div>

                <div>
                  <Button
                    label="Filter"
                    icon="pi pi-filter"
                    class="w-full md:w-auto"
                    @click="applyFilter"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Leave Table -->
          <div class="col-12">
            <div
              class="p-4 border-1 surface-border border-round-2xl surface-card"
            >
              <div class="flex align-items-center justify-content-between mb-4">
                <div class="flex align-items-center gap-3">
                  <span class="text-xl font-semibold">Data Pengajuan Cuti</span>
                  <div class="flex align-items-center gap-2 text-600 text-sm">
                    <i class="pi pi-database"></i>
                    <span>
                      Total:
                      <span class="font-semibold text-color">{{
                        filteredLeaves.length
                      }}</span>
                    </span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <Button
                    label="Ekspor Excel"
                    icon="pi pi-file-excel"
                    severity="success"
                    outlined
                    @click="exportExcel"
                    :disabled="loading || !filteredLeaves.length"
                  />
                </div>
              </div>

              <DataTable
                :value="filteredLeaves"
                :paginator="true"
                :rows="10"
                :loading="loading"
                :rowsPerPageOptions="[10, 20, 50]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
              >
                <Column field="user.username" header="Karyawan" sortable>
                  <template #body="{ data }">
                    {{ data?.user?.username || "-" }}
                  </template>
                </Column>

                <Column field="type" header="Tipe" sortable>
                  <template #body="{ data }">
                    <Tag
                      :value="(data.type || 'leave').toUpperCase()"
                      severity="info"
                    />
                  </template>
                </Column>

                <Column field="startDate" header="Mulai" sortable>
                  <template #body="{ data }">
                    {{ formatDate(data.startDate || data.start || data.from) }}
                  </template>
                </Column>

                <Column field="endDate" header="Selesai" sortable>
                  <template #body="{ data }">
                    {{ formatDate(data.endDate || data.end || data.to) }}
                  </template>
                </Column>

                <Column field="reason" header="Alasan">
                  <template #body="{ data }">
                    <span class="truncate">{{ data.reason || "-" }}</span>
                  </template>
                </Column>

                <!-- Inline update status -->
                <Column field="status" header="Status" sortable>
                  <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                      <Dropdown
                        v-model="data._localStatus"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-10rem"
                        @change="onChangeStatus(data)"
                        :disabled="loadingIds.has(getId(data))"
                      />
                      <i
                        v-if="loadingIds.has(getId(data))"
                        class="pi pi-spin pi-spinner text-600"
                        aria-label="saving"
                      ></i>
                    </div>
                  </template>
                </Column>

                <Column header="Aksi" style="width: 170px">
                  <template #body="{ data }">
                    <div class="flex gap-2">
                      <Button
                        label="Approve"
                        icon="pi pi-check"
                        size="small"
                        severity="success"
                        outlined
                        @click="quickSetStatus(data, 'approved')"
                        :disabled="
                          loadingIds.has(getId(data)) ||
                          data._localStatus === 'approved'
                        "
                      />
                      <Button
                        label="Decline"
                        icon="pi pi-times"
                        size="small"
                        severity="danger"
                        outlined
                        @click="quickSetStatus(data, 'declined')"
                        :disabled="
                          loadingIds.has(getId(data)) ||
                          data._localStatus === 'declined'
                        "
                      />
                      <Button
                        icon="pi pi-trash"
                        text
                        rounded
                        severity="secondary"
                        v-tooltip.top="'Batalkan pengajuan'"
                        @click="cancelLeave(getId(data))"
                        :disabled="loadingIds.has(getId(data))"
                      />
                    </div>
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
import {
  cancelLeave as cancelLeaveAPI,
  getAllLeaves,
  getUsersByCompany,
  updateLeaveStatus,
} from "../../api/api";

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
    Dropdown,
    Calendar,
  },
  setup() {
    const companyId = localStorage.getItem("companyId");

    const leaves = ref([]);
    const users = ref([]);
    const loading = ref(false);
    const loadingIds = ref(new Set());

    // Filters
    const filterStart = ref(null);
    const filterEnd = ref(null);
    const filterUser = ref(null);
    const filterStatus = ref(null);

    const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Declined", value: "declined" },
      { label: "Canceled", value: "canceled" },
    ];

    const userOptions = computed(() =>
      (users.value || []).map((u) => ({
        label: u.username,
        value: u._id || u.id || u.username,
      }))
    );

    const fetchLeaves = async () => {
      loading.value = true;
      try {
        const [leavesRes, usersRes] = await Promise.all([
          getAllLeaves(),
          getUsersByCompany(companyId),
        ]);
        const raw = Array.isArray(leavesRes.data) ? leavesRes.data : [];
        leaves.value = raw.map((l) => ({
          ...l,
          _localStatus: l.status || "pending",
        }));
        users.value = Array.isArray(usersRes.data) ? usersRes.data : [];
      } catch (err) {
        alert(err?.response?.data?.error || "Gagal memuat data cuti");
      } finally {
        loading.value = false;
      }
    };

    const getId = (row) => row?._id || row?.id;

    const filteredLeaves = computed(() => {
      const start = filterStart.value
        ? new Date(filterStart.value).setHours(0, 0, 0, 0)
        : null;
      const end = filterEnd.value
        ? new Date(filterEnd.value).setHours(23, 59, 59, 999)
        : null;
      const u = filterUser.value;
      const s = filterStatus.value;

      return (leaves.value || []).filter((lv) => {
        const begin = new Date(lv.startDate || lv.start || lv.from).getTime();
        const finish = new Date(
          lv.endDate || lv.end || lv.to || lv.startDate || lv.start || lv.from
        ).getTime();

        const matchStart = !start || finish >= start;
        const matchEnd = !end || begin <= end;

        const userId = lv?.user?._id || lv?.user?.id || lv?.userId;
        const userName = lv?.user?.username;
        const matchUser = !u || u === userId || u === userName;

        const matchStatus = !s || (lv._localStatus || lv.status) === s;

        return matchStart && matchEnd && matchUser && matchStatus;
      });
    });

    const applyFilter = () => {
      // Computed sudah reaktif; ini hanya tombol pemicu (UX).
    };

    const setRowLoading = (id, state) => {
      if (!id) return;
      const set = new Set(loadingIds.value);
      state ? set.add(id) : set.delete(id);
      loadingIds.value = set;
    };

    const saveStatus = async (row, nextStatus) => {
      const id = getId(row);
      if (!id) return;
      setRowLoading(id, true);
      try {
        await updateLeaveStatus(id, nextStatus);
        row.status = nextStatus;
        row._localStatus = nextStatus;
      } catch (err) {
        row._localStatus = row.status || "pending";
        alert(err?.response?.data?.error || "Gagal memperbarui status");
      } finally {
        setRowLoading(id, false);
      }
    };

    const onChangeStatus = async (row) => {
      await saveStatus(row, row._localStatus);
    };

    const quickSetStatus = async (row, status) => {
      row._localStatus = status;
      await saveStatus(row, status);
    };

    const cancelLeave = async (id) => {
      if (!id) return;
      if (!confirm("Batalkan pengajuan ini?")) return;
      setRowLoading(id, true);
      try {
        await cancelLeaveAPI(id);
        await fetchLeaves();
      } catch (err) {
        alert(err?.response?.data?.error || "Gagal membatalkan pengajuan");
      } finally {
        setRowLoading(id, false);
      }
    };

    const formatDate = (d) => {
      if (!d) return "-";
      try {
        return new Date(d).toLocaleDateString("id-ID");
      } catch {
        return d;
      }
    };

    // ========= EXPORT EXCEL (mengikuti data terfilter) =========
    const exportExcel = async () => {
      try {
        if (!filteredLeaves.value.length) {
          alert("Tidak ada data untuk diekspor.");
          return;
        }
        const XLSX = await import("xlsx");

        const rows = filteredLeaves.value.map((lv, idx) => {
          const username = lv?.user?.username || "-";
          const start = lv.startDate || lv.start || lv.from || null;
          const end =
            lv.endDate ||
            lv.end ||
            lv.to ||
            lv.startDate ||
            lv.start ||
            lv.from ||
            null;

          return {
            No: idx + 1,
            Karyawan: username,
            Tipe: (lv?.type || "leave").toUpperCase(),
            Mulai: formatDate(start),
            Selesai: formatDate(end),
            Alasan: lv?.reason || "-",
            Status: (lv?._localStatus || lv?.status || "pending")
              .toString()
              .toUpperCase(),
            Late: lv?.late ? "Ya" : "Tidak",
            Latitude: lv?.location?.latitude ?? "",
            Longitude: lv?.location?.longitude ?? "",
          };
        });

        const ws = XLSX.utils.json_to_sheet(rows);

        // Auto width kolom
        const headers = Object.keys(rows[0] || { No: "" });
        ws["!cols"] = headers.map((key) => {
          const maxLen = rows.reduce((acc, row) => {
            const val = row[key] != null ? String(row[key]) : "";
            return Math.max(acc, val.length);
          }, key.length);
          return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cuti");

        // Nama file dinamis sesuai filter
        const fmtDate = (d) =>
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(d.getDate()).padStart(2, "0")}`;

        let suffix = "ALL";
        if (filterStart.value || filterEnd.value) {
          const sStr = filterStart.value
            ? fmtDate(new Date(filterStart.value))
            : "ALL";
          const eStr = filterEnd.value
            ? fmtDate(new Date(filterEnd.value))
            : "ALL";
          suffix = `${sStr}_to_${eStr}`;
        }

        const statusSuffix = filterStatus.value
          ? `_${filterStatus.value.toUpperCase()}`
          : "";
        const userSuffix = filterUser.value ? `_user` : "";

        XLSX.writeFile(wb, `leaves_${suffix}${statusSuffix}${userSuffix}.xlsx`);
      } catch (err) {
        console.error("Gagal ekspor Excel:", err);
        alert("Gagal ekspor Excel.");
      }
    };

    onMounted(fetchLeaves);

    return {
      // data
      leaves,
      users,
      loading,
      loadingIds,

      // filter
      filterStart,
      filterEnd,
      filterUser,
      filterStatus,
      userOptions,
      statusOptions,
      filteredLeaves,
      applyFilter,

      // actions
      onChangeStatus,
      quickSetStatus,
      cancelLeave,
      exportExcel,

      // utils
      formatDate,
      getId,
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
.truncate {
  max-width: 32ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: bottom;
}
</style>
