<script setup lang="ts">
import { useRouter } from "vue-router";

// PrimeVue components (on-demand)
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";
import Menubar from "primevue/menubar";
import Tag from "primevue/tag";

const router = useRouter();
const getStarted = () => router.push("/register-company");

const items = [
  {
    label: "Fitur",
    command: () =>
      document
        .getElementById("features")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    label: "Statistik",
    command: () =>
      document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    label: "Testimoni",
    command: () =>
      document
        .getElementById("testimonials")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    label: "FAQ",
    command: () =>
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }),
  },
];
</script>

<template>
  <div class="surface-ground min-h-screen flex flex-column">
    <!-- Navbar -->
    <Menubar :model="items" class="sticky top-0 z-5 surface-card">
      <template #start>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-calendar-check text-primary text-xl" />
          <span class="font-semibold">Smart Attendance</span>
          <Tag severity="secondary" value="v1.0" class="ml-2" />
        </div>
      </template>
      <template #end>
        <div class="flex gap-2">
          <Button label="Masuk" text @click="() => router.push('/login')" />
          <Button label="Coba Gratis" @click="getStarted" />
        </div>
      </template>
    </Menubar>

    <!-- Hero -->
    <section class="container mx-auto p-4 md:p-6 flex-grow-1">
      <div class="grid align-items-center">
        <div class="col-12 md:col-6">
          <Tag value="#HRTech • #Productivity" severity="info" class="mb-3" />
          <h1 class="text-4xl md:text-5xl font-bold line-height-2">
            Selamat Datang di
            <span class="text-primary">Smart Attendance System</span>
          </h1>
          <p class="text-color-secondary text-lg mt-3">
            Pantau kehadiran karyawan, kelola cuti, dan lihat statistik
            perusahaan Anda dengan mudah. Tingkatkan kedisiplinan dan efisiensi
            HR hanya dalam beberapa klik.
          </p>
          <div class="flex flex-wrap gap-2 mt-4">
            <Button size="large" label="Get Started" @click="getStarted" />
            <Button
              size="large"
              label="Lihat Demo"
              outlined
              @click="() => router.push('/demo')"
            />
          </div>
          <div class="flex align-items-center gap-4 text-color-secondary mt-4">
            <span class="flex align-items-center gap-2"
              ><i class="pi pi-shield" /> Keamanan enterprise</span
            >
            <span class="flex align-items-center gap-2"
              ><i class="pi pi-clock" /> Implementasi
              <strong>< 1 hari</strong></span
            >
          </div>
        </div>
        <div class="col-12 md:col-6">
          <Card class="shadow-2 mt-5 md:mt-0">
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-building" /> Dashboard Kehadiran
              </div>
            </template>
            <template #content>
              <div class="grid">
                <div class="col-12 md:col-4">
                  <div
                    class="border-1 surface-border surface-card p-3 border-round-2xl"
                  >
                    <p class="text-color-secondary text-sm">
                      Kehadiran Hari Ini
                    </p>
                    <p class="text-4xl font-bold">96%</p>
                  </div>
                </div>
                <div class="col-12 md:col-4">
                  <div
                    class="border-1 surface-border surface-card p-3 border-round-2xl"
                  >
                    <p class="text-color-secondary text-sm">Terlambat</p>
                    <p class="text-4xl font-bold">12</p>
                  </div>
                </div>
                <div class="col-12 md:col-4">
                  <div
                    class="border-1 surface-border surface-card p-3 border-round-2xl"
                  >
                    <p class="text-color-secondary text-sm">Cuti Aktif</p>
                    <p class="text-4xl font-bold">4</p>
                  </div>
                </div>
              </div>
              <Divider class="my-4" />
              <div class="flex align-items-center gap-3">
                <Avatar label="AR" shape="circle" size="large" />
                <div>
                  <p class="m-0 font-medium">Andi R.</p>
                  <small class="text-color-secondary"
                    >Karyawan check-in pukul 08:55</small
                  >
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="container mx-auto p-4 md:p-6">
      <div class="text-center">
        <h2 class="text-3xl md:text-4xl font-semibold">
          Semua yang Anda Butuhkan
        </h2>
        <p class="text-color-secondary mt-2">
          Fitur lengkap untuk tim HR, supervisor, dan karyawan.
        </p>
      </div>
      <div class="grid mt-4">
        <div class="col-12 md:col-4">
          <Card class="h-full hover:shadow-3 transition-duration-200">
            <template #title
              ><i class="pi pi-calendar mr-2" />Absensi Real‑time</template
            >
            <template #content>
              <p class="text-color-secondary">
                Check‑in/out via web & mobile, geo‑fencing, dan foto selfie
                verifikasi.
              </p>
            </template>
          </Card>
        </div>
        <div class="col-12 md:col-4">
          <Card class="h-full hover:shadow-3 transition-duration-200">
            <template #title
              ><i class="pi pi-users mr-2" />Manajemen Cuti</template
            >
            <template #content>
              <p class="text-color-secondary">
                Pengajuan & persetujuan cuti multi‑level, saldo otomatis,
                notifikasi.
              </p>
            </template>
          </Card>
        </div>
        <div class="col-12 md:col-4">
          <Card class="h-full hover:shadow-3 transition-duration-200">
            <template #title
              ><i class="pi pi-chart-bar mr-2" />Insight & Laporan</template
            >
            <template #content>
              <p class="text-color-secondary">
                Grafik produktivitas, ketidakhadiran, ekspor ke Excel/PDF.
              </p>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section id="stats" class="surface-100">
      <div class="container mx-auto p-4 md:p-6">
        <div class="grid">
          <div class="col-12 md:col-4">
            <div
              class="border-1 surface-border surface-card p-4 text-center border-round-2xl"
            >
              <p class="text-color-secondary text-sm">Perusahaan Terbantu</p>
              <p class="text-5xl font-bold">120+</p>
            </div>
          </div>
          <div class="col-12 md:col-4">
            <div
              class="border-1 surface-border surface-card p-4 text-center border-round-2xl"
            >
              <p class="text-color-secondary text-sm">Waktu Setup</p>
              <p class="text-5xl font-bold">&lt; 1 hari</p>
            </div>
          </div>
          <div class="col-12 md:col-4">
            <div
              class="border-1 surface-border surface-card p-4 text-center border-round-2xl"
            >
              <p class="text-color-secondary text-sm">Akurasi Data</p>
              <p class="text-5xl font-bold">99.9%</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="container mx-auto p-4 md:p-6">
      <div class="text-center">
        <h2 class="text-3xl md:text-4xl font-semibold">
          Dipercaya Tim HR Modern
        </h2>
        <p class="text-color-secondary mt-2">
          Apa kata mereka setelah pindah ke Smart Attendance.
        </p>
      </div>
      <div class="grid mt-4">
        <div class="col-12 md:col-6">
          <Card>
            <template #content>
              <p>
                "Approval cuti jadi rapi dan cepat. Laporan bulanan tinggal
                klik."
              </p>
              <div class="flex align-items-center gap-3 mt-3">
                <Avatar label="DA" size="large" />
                <div>
                  <p class="m-0 font-medium">Dewi A.</p>
                  <small class="text-color-secondary">HR Manager, Fintek</small>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="col-12 md:col-6">
          <Card>
            <template #content>
              <p>
                "Tim lebih disiplin karena notifikasi telat & rekap otomatis."
              </p>
              <div class="flex align-items-center gap-3 mt-3">
                <Avatar label="RA" size="large" />
                <div>
                  <p class="m-0 font-medium">Raka A.</p>
                  <small class="text-color-secondary">People Ops, Ritel</small>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="container mx-auto p-4 md:p-6 pb-6">
      <h2 class="text-2xl md:text-3xl font-semibold">Pertanyaan Umum</h2>
      <div class="grid mt-3">
        <div class="col-12">
          <Card>
            <template #title>Apakah mendukung multi‑cabang?</template>
            <template #content>
              <p class="text-color-secondary">
                Ya, Anda bisa membuat lokasi/cabang berbeda dan atur jadwal tiap
                cabang.
              </p>
            </template>
          </Card>
        </div>
        <div class="col-12">
          <Card>
            <template #title>Bisakah integrasi dengan payroll?</template>
            <template #content>
              <p class="text-color-secondary">
                Bisa diekspor CSV/Excel untuk di‑import ke sistem payroll.
                Integrasi API tersedia.
              </p>
            </template>
          </Card>
        </div>
      </div>
      <div class="flex justify-content-center mt-3">
        <Button size="large" label="Mulai Sekarang" @click="getStarted" />
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-top-1 surface-border py-3">
      <div
        class="container mx-auto px-3 flex align-items-center justify-content-between text-color-secondary text-sm"
      >
        <span
          >© {{ new Date().getFullYear() }} Smart Attendance. All rights
          reserved.</span
        >
        <div class="flex gap-3">
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Syarat</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.container {
  max-width: 1120px;
}
</style>
