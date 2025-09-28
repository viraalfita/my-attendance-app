<template>
  <div class="admin-layout">
    <div class="main-content">
      <main class="p-4">
        <div class="grid border-round-2xl border-1 surface-border p-4">
          <!-- Page Header -->
          <div class="col-12">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-users text-2xl text-primary"></i>
              <h1 class="text-3xl font-bold m-0">Manajemen Pengguna</h1>
            </div>
          </div>

          <!-- Filters (konsisten tanpa Card) -->
          <div class="col-12">
            <div
              class="p-4 border-1 surface-border border-round-2xl surface-card"
            >
              <div
                class="flex flex-wrap align-items-end gap-3 justify-content-between"
              >
                <!-- Input filters -->
                <div class="flex flex-wrap gap-3">
                  <div>
                    <label class="block text-900 font-medium mb-2"
                      >Nama Pengguna</label
                    >
                    <InputText
                      v-model="filterName"
                      placeholder="Cari username..."
                      class="w-full md:w-14rem"
                    />
                  </div>
                  <div>
                    <label class="block text-900 font-medium mb-2">Peran</label>
                    <Dropdown
                      v-model="filterRole"
                      :options="dynamicRoleOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Semua Peran"
                      class="w-full md:w-14rem"
                      showClear
                    />
                  </div>
                </div>

                <!-- Tombol Filter -->
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

          <!-- Users Table (konsisten tanpa Card) -->
          <div class="col-12">
            <div
              class="p-4 border-1 surface-border border-round-2xl surface-card"
            >
              <div class="flex align-items-center justify-content-between mb-4">
                <div class="flex align-items-center gap-3">
                  <span class="text-xl font-semibold">Daftar Pengguna</span>
                  <div class="flex align-items-center gap-2 text-600 text-sm">
                    <i class="pi pi-database"></i>
                    <span>
                      Total:
                      <span class="font-semibold text-color">{{
                        filteredUsers.length
                      }}</span>
                    </span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <Button
                    label="Tambah Pengguna"
                    icon="pi pi-plus"
                    severity="primary"
                    @click="openAddModal"
                  />
                  <Button
                    label="Ekspor Excel"
                    icon="pi pi-file-excel"
                    severity="success"
                    outlined
                    @click="exportExcel"
                    :disabled="loading || !filteredUsers.length"
                  />
                </div>
              </div>

              <DataTable
                :value="filteredUsers"
                :paginator="true"
                :rows="10"
                :loading="loading"
                :rowsPerPageOptions="[10, 20, 50]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
              >
                <Column field="username" header="Username" sortable />
                <Column field="role" header="Peran" sortable>
                  <template #body="{ data }">
                    <Tag :value="data.role || 'employee'" severity="info" />
                  </template>
                </Column>
                <Column header="Aksi" style="width: 120px">
                  <template #body="{ data }">
                    <Button
                      icon="pi pi-trash"
                      text
                      rounded
                      severity="danger"
                      @click="deleteUser(data._id || data.id)"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Tambah Pengguna -->
    <Dialog
      v-model:visible="showAddModal"
      modal
      header="Tambah Pengguna"
      class="w-full md:w-30rem"
      :closable="!loading"
    >
      <form @submit.prevent="addUser" class="flex flex-column gap-3">
        <div>
          <label for="username" class="block text-900 font-medium mb-2"
            >Username</label
          >
          <InputText
            id="username"
            v-model="username"
            class="w-full"
            placeholder="Masukkan username"
            required
            :disabled="loading"
          />
        </div>

        <div>
          <label for="password" class="block text-900 font-medium mb-2"
            >Password</label
          >
          <Password
            id="password"
            v-model="password"
            class="w-full"
            inputClass="w-full"
            placeholder="Masukkan password"
            :feedback="false"
            toggleMask
            :disabled="loading"
            required
          />
        </div>

        <div>
          <label for="role" class="block text-900 font-medium mb-2"
            >Peran</label
          >
          <Dropdown
            id="role"
            v-model="selectedRole"
            :options="roleOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Pilih peran"
            class="w-full"
            :disabled="loading"
          />
        </div>

        <div class="flex justify-content-end gap-2 mt-2">
          <Button
            type="button"
            label="Batal"
            severity="secondary"
            text
            :disabled="loading"
            @click="showAddModal = false"
          />
          <Button
            type="submit"
            label="Simpan"
            icon="pi pi-check"
            :loading="loading"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import {
  deleteUser as deleteUserAPI,
  getUsersByCompany,
  registerAdmin,
  registerEmployee,
} from "../../api/api";

// PrimeVue Components
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Tag from "primevue/tag";

export default {
  components: {
    DataTable,
    Column,
    Tag,
    Button,
    Dropdown,
    InputText,
    Password,
    Dialog,
  },
  setup() {
    const companyId = localStorage.getItem("companyId");
    const companyCode = localStorage.getItem("companyCode");

    // data
    const users = ref([]);
    const loading = ref(false);

    // filters
    const filterName = ref("");
    const filterRole = ref(null); // null = semua

    // modal form
    const showAddModal = ref(false);
    const username = ref("");
    const password = ref("");
    const selectedRole = ref("employee"); // default

    const roleOptions = [
      { label: "Employee", value: "employee" },
      { label: "Admin", value: "admin" },
    ];

    // Role list dinamis dari data users
    const dynamicRoleOptions = computed(() => {
      const roles = new Set(
        (users.value || []).map((u) => u.role || "employee")
      );
      return Array.from(roles).map((r) => ({
        label: r.charAt(0).toUpperCase() + r.slice(1),
        value: r,
      }));
    });

    const fetchUsers = async () => {
      loading.value = true;
      try {
        const res = await getUsersByCompany(companyId);
        users.value = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        alert(err?.response?.data?.error || "Gagal memuat data pengguna");
      } finally {
        loading.value = false;
      }
    };

    const filteredUsers = computed(() => {
      const name = (filterName.value || "").toLowerCase();
      const roleF = filterRole.value;
      return (users.value || []).filter((u) => {
        const matchName =
          !name || (u.username || "").toLowerCase().includes(name);
        const currentRole = u.role || "employee";
        const matchRole = !roleF || currentRole === roleF;
        return matchName && matchRole;
      });
    });

    const applyFilter = () => {};

    const openAddModal = () => {
      username.value = "";
      password.value = "";
      selectedRole.value = "employee";
      showAddModal.value = true;
    };

    const addUser = async () => {
      loading.value = true;
      try {
        if (selectedRole.value === "admin") {
          await registerAdmin({
            username: username.value,
            password: password.value,
            companyCode,
          });
        } else {
          await registerEmployee({
            username: username.value,
            password: password.value,
            companyCode,
          });
        }
        showAddModal.value = false;
        await fetchUsers();
      } catch (err) {
        alert(
          err?.response?.data?.error ||
            "Terjadi kesalahan saat menambah pengguna"
        );
      } finally {
        loading.value = false;
      }
    };

    const deleteUser = async (id) => {
      if (!id) return;
      if (confirm("Hapus pengguna ini?")) {
        try {
          await deleteUserAPI(id);
          await fetchUsers();
        } catch (err) {
          alert(err?.response?.data?.error || "Gagal menghapus pengguna");
        }
      }
    };

    const findDateField = (u) =>
      u?.createdAt || u?.created_at || u?.created || u?.updatedAt || null;

    const formatDate = (dateString) => {
      if (!dateString) return "-";
      try {
        return new Date(dateString).toLocaleString("id-ID");
      } catch {
        return dateString;
      }
    };

    // ============ EXPORT EXCEL ============
    const exportExcel = async () => {
      try {
        if (!filteredUsers.value?.length) {
          alert("Tidak ada data untuk diekspor.");
          return;
        }

        const XLSX = await import("xlsx");

        const rows = filteredUsers.value.map((u, idx) => {
          const created =
            findDateField(u) ||
            u.createdAt ||
            u.created_at ||
            u.created ||
            null;

          return {
            No: idx + 1,
            Username: u.username || "-",
            Peran: (u.role || "employee").toUpperCase(),
          };
        });

        // worksheet
        const ws = XLSX.utils.json_to_sheet(rows);

        // auto width kolom
        const headers = Object.keys(rows[0] || { No: "" });
        ws["!cols"] = headers.map((key) => {
          const maxLen = rows.reduce((acc, row) => {
            const val = row[key] != null ? String(row[key]) : "";
            return Math.max(acc, val.length);
          }, key.length);
          return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
        });

        // workbook & save
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pengguna");

        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        XLSX.writeFile(wb, `daftar-pengguna_${yyyy}-${mm}-${dd}.xlsx`);
      } catch (err) {
        console.error("Gagal ekspor Excel:", err);
        alert("Gagal ekspor Excel.");
      }
    };

    onMounted(fetchUsers);

    return {
      users,
      loading,
      filterName,
      filterRole,
      dynamicRoleOptions,
      applyFilter,
      filteredUsers,
      showAddModal,
      username,
      password,
      selectedRole,
      roleOptions,
      openAddModal,
      addUser,
      deleteUser,
      findDateField,
      formatDate,
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
