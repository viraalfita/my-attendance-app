<template>
  <div class="dashboard-content">
    <div class="grid">
      <!-- Statistik Cards -->
      <div class="col-12 md:col-6 lg:col-3">
        <Card class="h-full">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <span class="block text-500 font-medium mb-3">Total Users</span>
                <div class="text-900 font-bold text-3xl" aria-live="polite">
                  <template v-if="!loading">{{ totalUsers }}</template>
                  <template v-else
                    ><i class="pi pi-spin pi-spinner"
                  /></template>
                </div>
              </div>
              <div class="flex-shrink-0">
                <i class="pi pi-users text-primary text-4xl"></i>
              </div>
            </div>
            <div class="mt-3">
              <span class="text-green-500 font-medium">
                <i class="pi pi-arrow-up"></i>
                <span class="ml-1">12%</span>
              </span>
              <span class="text-500 ml-2">since last week</span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="h-full">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <span class="block text-500 font-medium mb-3"
                  >Today's Attendance</span
                >
                <div class="text-900 font-bold text-3xl" aria-live="polite">
                  <template v-if="!loading"
                    >{{ todaysAttendancePct }}%</template
                  >
                  <template v-else
                    ><i class="pi pi-spin pi-spinner"
                  /></template>
                </div>
              </div>
              <div class="flex-shrink-0">
                <i class="pi pi-calendar-check text-blue-500 text-4xl"></i>
              </div>
            </div>
            <div class="mt-3">
              <span class="text-green-500 font-medium">
                <i class="pi pi-arrow-up"></i>
                <span class="ml-1">5%</span>
              </span>
              <span class="text-500 ml-2">since yesterday</span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="h-full">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <span class="block text-500 font-medium mb-3"
                  >Pending Leave</span
                >
                <div class="text-900 font-bold text-3xl" aria-live="polite">
                  <template v-if="!loading">{{ pendingLeaveCount }}</template>
                  <template v-else
                    ><i class="pi pi-spin pi-spinner"
                  /></template>
                </div>
              </div>
              <div class="flex-shrink-0">
                <i class="pi pi-clock text-orange-500 text-4xl"></i>
              </div>
            </div>
            <div class="mt-3">
              <span class="text-red-500 font-medium">
                <i class="pi pi-arrow-down"></i>
                <span class="ml-1">3%</span>
              </span>
              <span class="text-500 ml-2">since last week</span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="h-full">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <span class="block text-500 font-medium mb-3"
                  >Active Sessions</span
                >
                <div class="text-900 font-bold text-3xl" aria-live="polite">
                  <template v-if="!loading">{{ activeSessions }}</template>
                  <template v-else
                    ><i class="pi pi-spin pi-spinner"
                  /></template>
                </div>
              </div>
              <div class="flex-shrink-0">
                <i class="pi pi-eye text-purple-500 text-4xl"></i>
              </div>
            </div>
            <div class="mt-3">
              <span class="text-green-500 font-medium">
                <i class="pi pi-arrow-up"></i>
                <span class="ml-1">8%</span>
              </span>
              <span class="text-500 ml-2">since last hour</span>
            </div>
          </template>
        </Card>
      </div>

      <!-- Charts Section -->
      <div class="col-12 lg:col-8">
        <Card>
          <template #title>Attendance Overview</template>
          <template #content>
            <apexchart
              type="line"
              height="300"
              :options="attendanceOptions"
              :series="attendanceSeries"
            />
          </template>
        </Card>
      </div>

      <!-- Leave Distribution -->
      <div class="col-12 lg:col-4">
        <Card>
          <template #title>Leave Distribution</template>
          <template #content>
            <apexchart
              type="donut"
              height="300"
              :options="leaveOptions"
              :series="leaveSeries"
            />
          </template>
        </Card>
      </div>

      <!-- Recent Activity -->
      <div class="col-12">
        <Card>
          <template #title>Recent Activity</template>
          <template #content>
            <DataTable :value="recentActivities" class="p-datatable-sm">
              <Column field="time" header="Time"></Column>
              <Column field="user" header="User"></Column>
              <Column field="action" header="Action"></Column>
              <Column field="details" header="Details"></Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "primevue/card";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { computed, onMounted, ref } from "vue";

import {
  fetchAllLeaves,
  fetchAttendanceByCompany,
  fetchTodayAttendanceByCompany,
  fetchUsersByCompany,
} from "/src/api/dashboard";

export default {
  name: "DashboardContent",
  components: { Card, DataTable, Column },
  setup() {
    const companyId = localStorage.getItem("companyId");
    const tz = ref(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

    const loading = ref(false);

    const users = ref([]);
    const todayAttendance = ref([]);
    const allAttendance = ref([]);
    const allLeaves = ref([]);
    const recentActivities = ref([]);

    const totalUsers = computed(() => users.value.length);

    const todayCheckedInUserIds = computed(() => {
      const set = new Set();
      for (const r of todayAttendance.value) {
        if (r?.type === "checkin" && r?.userId?._id)
          set.add(String(r.userId._id));
        else if (r?.type === "checkin" && r?.userId) set.add(String(r.userId));
      }
      return set;
    });

    const todaysAttendancePct = computed(() => {
      if (!totalUsers.value) return 0;
      return Math.round(
        (todayCheckedInUserIds.value.size / totalUsers.value) * 100
      );
    });

    const companyUserIds = computed(
      () => new Set(users.value.map((u) => String(u._id || u.id)))
    );
    const pendingLeaveCount = computed(() => {
      return allLeaves.value.filter(
        (l) =>
          l?.status === "waiting" &&
          companyUserIds.value.has(String(l?.userId?._id || l?.userId))
      ).length;
    });

    const activeSessions = computed(() => {
      const latestByUser = new Map();
      for (const r of todayAttendance.value) {
        const uid = String(r?.userId?._id || r?.userId || "");
        if (!uid) continue;
        const t = new Date(
          r.time || r.createdAt || r.updatedAt || Date.now()
        ).getTime();
        const cur = latestByUser.get(uid);
        if (!cur || t > cur.t) latestByUser.set(uid, { t, type: r.type });
      }
      let count = 0;
      latestByUser.forEach((v) => {
        if (v.type === "checkin") count += 1;
      });
      return count;
    });

    const attendanceSeries = ref([
      { name: "Present", data: [] },
      { name: "Absent", data: [] },
    ]);

    const attendanceOptions = ref({
      chart: { toolbar: { show: false } },
      stroke: { curve: "smooth", width: 3 },
      xaxis: { categories: [] },
      markers: { size: 0 },
      legend: { position: "top" },
      grid: { strokeDashArray: 4 },
    });

    function buildLastNDaysLabels(n = 7) {
      const arr = [];
      const now = new Date();
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        arr.push(d.toLocaleDateString("en-GB", { weekday: "short" }));
      }
      return arr;
    }

    function aggregateAttendanceLast7Days() {
      const buckets = {};
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = d.toLocaleDateString("sv-SE", { timeZone: tz.value });
        buckets[key] = { checkinUsers: new Set() };
      }

      for (const rec of allAttendance.value) {
        const t = new Date(
          rec.time || rec.createdAt || rec.updatedAt || Date.now()
        );
        const key = t.toLocaleDateString("sv-SE", { timeZone: tz.value });

        if (!buckets[key]) continue;
        if (rec.type === "checkin") {
          const uid = String(rec?.userId?._id || rec?.userId || "");
          if (uid) buckets[key].checkinUsers.add(uid);
        }
      }

      const labels = buildLastNDaysLabels(7);
      const present = [];
      const absent = [];

      const keys = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        keys.push(d.toLocaleDateString("sv-SE", { timeZone: tz.value }));
      }

      for (const k of keys) {
        const presentCount = buckets[k]?.checkinUsers.size || 0;
        present.push(presentCount);
        absent.push(Math.max(totalUsers.value - presentCount, 0));
      }

      attendanceOptions.value.xaxis.categories = labels;
      attendanceSeries.value = [
        { name: "Present", data: present },
        { name: "Absent", data: absent },
      ];
    }

    const leaveSeries = ref([]);
    const leaveOptions = ref({
      labels: [],
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E5E7EB"],
      chart: { toolbar: { show: false } },
      legend: { show: true, position: "bottom" },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(0)}%`,
      },
      tooltip: {
        y: {
          formatter: (val, opts) => {
            const pct =
              opts.globals.seriesPercent[opts.seriesIndex][0].toFixed(0);
            return `${val} (${pct}%)`;
          },
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              name: { show: true, fontWeight: 600 },
              value: { show: true, formatter: (val) => `${Math.round(val)}` },
              total: {
                show: true,
                label: "Total",
                formatter: (w) =>
                  w.globals.seriesTotals.reduce((a, b) => a + b, 0),
              },
            },
          },
        },
      },
      stroke: { width: 0 },
    });

    function aggregateLeaveDonutLast30d() {
      const now = new Date();
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 30);

      const counts = new Map();
      for (const l of allLeaves.value) {
        const uid = String(l?.userId?._id || l?.userId || "");
        if (!companyUserIds.value.has(uid)) continue;
        const created = new Date(
          l?.createdAt || l?.startDate || l?.endDate || now
        );
        if (created < cutoff) continue;

        const reason = (l?.reason || "Other").trim();
        counts.set(reason, (counts.get(reason) || 0) + 1);
      }

      const preferred = [
        "Sick Leave",
        "Annual Leave",
        "Emergency Leave",
        "Unpaid Leave",
      ];
      const labels = [];
      const data = [];

      preferred.forEach((p) => {
        if (counts.has(p)) {
          labels.push(p);
          data.push(counts.get(p));
          counts.delete(p);
        }
      });
      let otherSum = 0;
      counts.forEach((v, k) => {
        otherSum += v;
      });
      if (otherSum > 0) {
        labels.push("Other");
        data.push(otherSum);
      }

      if (labels.length === 0) {
        labels.push("No Data");
        data.push(1);
      }

      leaveOptions.value.labels = labels;
      leaveSeries.value = data;
    }

    function buildRecentActivities() {
      const arr = allAttendance.value
        .map((r) => {
          const time = new Date(
            r.time || r.createdAt || r.updatedAt || Date.now()
          );
          return {
            time: time.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            user: r?.userId?.username || r?.username || r?.userId || "-",
            action: r.type === "checkin" ? "Check-in" : "Check-out",
            details: r?.late ? "Late" : "On time",
            _ts: time.getTime(),
          };
        })
        .sort((a, b) => b._ts - a._ts)
        .slice(0, 10);
      recentActivities.value = arr;
    }

    async function loadAll() {
      if (!companyId) return;
      loading.value = true;
      try {
        const [usersRes, todayRes, allAttRes, leavesRes] = await Promise.all([
          fetchUsersByCompany(companyId),
          fetchTodayAttendanceByCompany(companyId, tz.value),
          fetchAttendanceByCompany(companyId),
          fetchAllLeaves(),
        ]);
        users.value = usersRes;
        todayAttendance.value = todayRes;
        allAttendance.value = allAttRes;
        allLeaves.value = leavesRes;

        aggregateAttendanceLast7Days();
        aggregateLeaveDonutLast30d();
        buildRecentActivities();
      } catch (e) {
        console.error("[DASHBOARD] loadAll error:", e);
      } finally {
        loading.value = false;
      }
    }

    onMounted(loadAll);

    return {
      totalUsers,
      todaysAttendancePct,
      pendingLeaveCount,
      activeSessions,
      attendanceSeries,
      attendanceOptions,
      leaveSeries,
      leaveOptions,
      recentActivities,
      loading,
    };
  },
};
</script>
<style scoped>
.dashboard-content {
  padding: 0;
}

:deep(.p-card) {
  height: 100%;
}

:deep(.p-card-content) {
  padding: 1.5rem;
}
</style>
