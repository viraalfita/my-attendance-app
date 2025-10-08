<script setup lang="ts">
import { onMounted, ref } from "vue";
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
  // NEW: menu tambahan
  {
    label: "Use Case",
    command: () =>
      document
        .getElementById("usecases")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    label: "Integrasi",
    command: () =>
      document
        .getElementById("integrations")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    label: "Harga",
    command: () =>
      document
        .getElementById("pricing")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
];

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);

  // NEW: animasi counter angka saat terlihat di viewport
  const counters = document.querySelectorAll(".counter");
  const asNumber = (el: Element) =>
    Number(
      (el as HTMLElement).dataset.to || (el as HTMLElement).textContent || "0"
    );
  const duration = 1200;

  const animate = (el: Element) => {
    const target = asNumber(el);
    let start = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(start + (target - start) * eased);
      (el as HTMLElement).textContent =
        String(val) + ((el as HTMLElement).dataset.suffix || "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((c) => io.observe(c));
});
</script>

<template>
  <div class="landing-page">
    <!-- Animated Background -->
    <div class="bg-animation">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Navbar -->
    <Menubar :model="items" class="navbar">
      <template #start>
        <div class="logo-container">
          <div class="logo-icon">
            <i class="pi pi-calendar-check" />
          </div>
          <span class="logo-text">Smart Attendance</span>
          <Tag severity="secondary" value="v1.0" class="version-tag" />
        </div>
      </template>
      <template #end>
        <div class="nav-actions">
          <Button
            label="Masuk"
            text
            class="btn-login"
            @click="() => router.push('/login')"
          />
          <Button label="Coba Gratis" class="btn-primary" @click="getStarted" />
        </div>
      </template>
    </Menubar>

    <!-- Hero Section -->
    <section class="hero-section" :class="{ 'fade-in': isVisible }">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <Tag
              value="#HRTech • #Productivity"
              severity="info"
              class="hero-tag"
            />
            <h1 class="hero-title">
              Selamat Datang di
              <span class="gradient-text">Smart Attendance System</span>
            </h1>
            <p class="hero-description">
              Pantau kehadiran karyawan, kelola cuti, dan lihat statistik
              perusahaan Anda dengan mudah. Tingkatkan kedisiplinan dan
              efisiensi HR hanya dalam beberapa klik.
            </p>
            <div class="hero-buttons">
              <Button
                size="large"
                label="Get Started"
                class="btn-primary btn-lg"
                @click="getStarted"
              />
              <Button
                size="large"
                label="Lihat Demo"
                outlined
                class="btn-outline btn-lg"
                @click="() => router.push('/demo')"
              />
            </div>
            <div class="hero-features">
              <span class="feature-badge">
                <i class="pi pi-shield" /> Keamanan enterprise
              </span>
              <span class="feature-badge">
                <i class="pi pi-clock" /> Implementasi
                <strong>&lt; 1 hari</strong>
              </span>
            </div>
          </div>
          <div class="hero-visual">
            <Card class="dashboard-card floating">
              <template #title>
                <div class="card-header">
                  <i class="pi pi-building" /> Dashboard Kehadiran
                </div>
              </template>
              <template #content>
                <div class="stats-grid">
                  <div class="stat-box stat-1">
                    <p class="stat-label">Kehadiran Hari Ini</p>
                    <p class="stat-value counter" data-to="96" data-suffix="%">
                      96%
                    </p>
                  </div>
                  <div class="stat-box stat-2">
                    <p class="stat-label">Terlambat</p>
                    <p class="stat-value counter" data-to="12">12</p>
                  </div>
                  <div class="stat-box stat-3">
                    <p class="stat-label">Cuti Aktif</p>
                    <p class="stat-value counter" data-to="4">4</p>
                  </div>
                </div>
                <Divider class="my-4" />
                <div class="activity-item slide-in">
                  <Avatar
                    label="AR"
                    shape="circle"
                    size="large"
                    class="pulse-avatar"
                  />
                  <div>
                    <p class="activity-name">Andi R.</p>
                    <small class="activity-time"
                      >Karyawan check-in pukul 08:55</small
                    >
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section (existing) -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Semua yang Anda Butuhkan</h2>
          <p class="section-subtitle">
            Fitur lengkap untuk tim HR, supervisor, dan karyawan.
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <Card class="card-hover">
              <template #title>
                <div class="feature-icon calendar-icon">
                  <i class="pi pi-calendar" />
                </div>
                <h3>Absensi Real-time</h3>
              </template>
              <template #content>
                <p class="feature-desc">
                  Check-in/out via web & mobile, geo-fencing, dan foto selfie
                  verifikasi.
                </p>
              </template>
            </Card>
          </div>
          <div class="feature-card">
            <Card class="card-hover">
              <template #title>
                <div class="feature-icon users-icon">
                  <i class="pi pi-users" />
                </div>
                <h3>Manajemen Cuti</h3>
              </template>
              <template #content>
                <p class="feature-desc">
                  Pengajuan & persetujuan cuti multi-level, saldo otomatis,
                  notifikasi.
                </p>
              </template>
            </Card>
          </div>
          <div class="feature-card">
            <Card class="card-hover">
              <template #title>
                <div class="feature-icon chart-icon">
                  <i class="pi pi-chart-bar" />
                </div>
                <h3>Insight & Laporan</h3>
              </template>
              <template #content>
                <p class="feature-desc">
                  Grafik produktivitas, ketidakhadiran, ekspor ke Excel/PDF.
                </p>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW: Use Cases -->
    <section id="usecases" class="usecases-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Cocok untuk Berbagai Skenario</h2>
          <p class="section-subtitle">Skalabel dari UMKM sampai Enterprise.</p>
        </div>
        <div class="usecase-grid">
          <Card class="usecase-card card-hover">
            <template #title><h3>Retail Multi-Cabang</h3></template>
            <template #content>
              <ul class="bullet">
                <li>Shift bergilir & jadwal toko berbeda</li>
                <li>Geo-fence per lokasi</li>
                <li>Rekap telat & lembur otomatis</li>
              </ul>
            </template>
          </Card>
          <Card class="usecase-card card-hover">
            <template #title><h3>Lapangan / Field Team</h3></template>
            <template #content>
              <ul class="bullet">
                <li>Check-in GPS + selfie verifikasi</li>
                <li>Riwayat rute & aktivitas</li>
                <li>Mode koneksi rendah</li>
              </ul>
            </template>
          </Card>
          <Card class="usecase-card card-hover">
            <template #title><h3>Kantor Hybrid</h3></template>
            <template #content>
              <ul class="bullet">
                <li>WFH/WFO policy & persetujuan</li>
                <li>Integrasi kalender tim</li>
                <li>Analitik produktivitas</li>
              </ul>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Stats Section (existing) -->
    <section id="stats" class="stats-section">
      <div class="container">
        <div class="stats-wrapper">
          <div class="stat-item">
            <div class="stat-card">
              <p class="stat-card-label">Perusahaan Terbantu</p>
              <p class="stat-card-value counter" data-to="120" data-suffix="+">
                120+
              </p>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-card">
              <p class="stat-card-label">Waktu Setup</p>
              <p class="stat-card-value">&lt; 1 hari</p>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-card">
              <p class="stat-card-label">Akurasi Data</p>
              <p class="stat-card-value counter" data-to="99" data-suffix=".9%">
                99.9%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW: How It Works -->
    <section id="howitworks" class="how-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Cara Kerja dalam 3 Langkah</h2>
          <p class="section-subtitle">Tanpa ribet. Langsung jalan.</p>
        </div>
        <div class="how-grid">
          <Card class="how-card card-hover">
            <template #title
              ><div class="step-badge">1</div>
              Daftar & Buat Perusahaan</template
            >
            <template #content
              ><p>
                Masukkan detail perusahaan, jam kerja, dan lokasi cabang.
              </p></template
            >
          </Card>
          <Card class="how-card card-hover">
            <template #title
              ><div class="step-badge">2</div>
              Undang Karyawan</template
            >
            <template #content
              ><p>
                Kirim undangan via WhatsApp, set role & approver cuti.
              </p></template
            >
          </Card>
          <Card class="how-card card-hover">
            <template #title
              ><div class="step-badge">3</div>
              Mulai Absen</template
            >
            <template #content
              ><p>
                Check-in/out lewat mobile, pantau dashboard real-time.
              </p></template
            >
          </Card>
        </div>
      </div>
    </section>

    <!-- Testimonials Section (existing) -->
    <section id="testimonials" class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Dipercaya Tim HR Modern</h2>
          <p class="section-subtitle">
            Apa kata mereka setelah pindah ke Smart Attendance.
          </p>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <Card class="card-hover testimonial">
              <template #content>
                <i class="pi pi-quote-left quote-icon"></i>
                <p class="testimonial-text">
                  Approval cuti jadi rapi dan cepat. Laporan bulanan tinggal
                  klik.
                </p>
                <div class="testimonial-author">
                  <Avatar label="DA" size="large" />
                  <div>
                    <p class="author-name">Dewi A.</p>
                    <small class="author-role">HR Manager, Fintek</small>
                  </div>
                </div>
              </template>
            </Card>
          </div>
          <div class="testimonial-card">
            <Card class="card-hover testimonial">
              <template #content>
                <i class="pi pi-quote-left quote-icon"></i>
                <p class="testimonial-text">
                  Tim lebih disiplin karena notifikasi telat & rekap otomatis.
                </p>
                <div class="testimonial-author">
                  <Avatar label="RA" size="large" />
                  <div>
                    <p class="author-name">Raka A.</p>
                    <small class="author-role">People Ops, Ritel</small>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW: Integrations -->
    <section id="integrations" class="integrations-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Integrasi</h2>
          <p class="section-subtitle">
            Hubungkan dengan tools favorit tim Anda.
          </p>
        </div>
        <div class="logo-strip">
          <span class="logo-chip"
            ><i class="pi pi-google"></i> Google Calendar</span
          >
          <span class="logo-chip"><i class="pi pi-slack"></i> Slack</span>
          <span class="logo-chip"
            ><i class="pi pi-microsoft"></i> Microsoft Teams</span
          >
          <span class="logo-chip"
            ><i class="pi pi-file-excel"></i> Excel/CSV</span
          >
          <span class="logo-chip"
            ><i class="pi pi-wallet"></i> Payroll API</span
          >
        </div>
      </div>
    </section>

    <!-- NEW: Pricing -->
    <section id="pricing" class="pricing-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Harga Sederhana</h2>
          <p class="section-subtitle">Mulai gratis, upgrade kapan saja.</p>
        </div>
        <div class="pricing-grid">
          <Card class="price-card card-hover">
            <template #title><h3>Starter</h3></template>
            <template #content>
              <p class="price-tag">Rp0<span>/bulan</span></p>
              <ul class="bullet">
                <li>Hingga 10 karyawan</li>
                <li>Absensi web & selfie</li>
                <li>Ekspor CSV/Excel</li>
              </ul>
              <Button
                class="btn-primary w-100"
                label="Coba Gratis"
                @click="getStarted"
              />
            </template>
          </Card>
          <Card class="price-card featured card-hover">
            <template #title><h3>Pro</h3></template>
            <template #content>
              <p class="price-tag">Rp19.000<span>/karyawan/bulan</span></p>
              <ul class="bullet">
                <li>Geo-fencing multi-lokasi</li>
                <li>Approval cuti multi-level</li>
                <li>Integrasi Slack & Calendar</li>
              </ul>
              <Button
                class="btn-primary w-100"
                label="Mulai Pro"
                @click="getStarted"
              />
            </template>
          </Card>
          <Card class="price-card card-hover">
            <template #title><h3>Enterprise</h3></template>
            <template #content>
              <p class="price-tag">Kustom</p>
              <ul class="bullet">
                <li>SSO, audit log, SLA</li>
                <li>Implementasi & pelatihan</li>
                <li>Integrasi payroll khusus</li>
              </ul>
              <Button
                class="btn-primary w-100"
                label="Hubungi Sales"
                @click="() => router.push('/contact')"
              />
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- FAQ Section (existing) -->
    <section id="faq" class="faq-section">
      <div class="container">
        <h2 class="section-title">Pertanyaan Umum</h2>
        <div class="faq-grid">
          <Card class="faq-card">
            <template #title>Apakah mendukung multi-cabang?</template>
            <template #content>
              <p class="faq-answer">
                Ya, Anda bisa membuat lokasi/cabang berbeda dan atur jadwal tiap
                cabang.
              </p>
            </template>
          </Card>
          <Card class="faq-card">
            <template #title>Bisakah integrasi dengan payroll?</template>
            <template #content>
              <p class="faq-answer">
                Bisa diekspor CSV/Excel untuk di-import ke sistem payroll.
                Integrasi API tersedia.
              </p>
            </template>
          </Card>

          <!-- NEW: extra FAQ -->
          <Card class="faq-card">
            <template #title>Apakah bisa tanpa aplikasi mobile?</template>
            <template #content>
              <p class="faq-answer">
                Bisa. Absensi web tersedia, dan dapat dibatasi via GPS/IP.
              </p>
            </template>
          </Card>
          <Card class="faq-card">
            <template #title>Bagaimana onboarding tim?</template>
            <template #content>
              <p class="faq-answer">
                Undang via email/link, impor karyawan dari Excel, atau sinkron
                via API.
              </p>
            </template>
          </Card>
        </div>
        <div class="cta-wrapper">
          <Button
            size="large"
            label="Mulai Sekarang"
            class="btn-primary btn-lg"
            @click="getStarted"
          />
        </div>
      </div>
    </section>

    <!-- NEW: CTA Banner -->
    <section class="cta-banner">
      <div class="container cta-banner-inner">
        <div>
          <h3>Siap membuat absensi jadi effortless?</h3>
          <p>
            Aktifkan dalam hitungan menit. Tanpa kartu absen & spreadsheet
            berantakan.
          </p>
        </div>
        <div class="cta-actions">
          <Button class="btn-primary" label="Coba Gratis" @click="getStarted" />
          <Button
            class="btn-outline"
            label="Jadwalkan Demo"
            @click="() => router.push('/demo')"
          />
        </div>
      </div>
    </section>

    <!-- NEW: Contact -->
    <section id="contact" class="contact-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Butuh Bantuan?</h2>
          <p class="section-subtitle">
            Tim kami siap membantu implementasi Anda.
          </p>
        </div>
        <div class="contact-grid">
          <Card class="contact-card card-hover">
            <template #title><i class="pi pi-envelope"></i> Email</template>
            <template #content><p>support@smartattendance.co</p></template>
          </Card>
          <Card class="contact-card card-hover">
            <template #title><i class="pi pi-whatsapp"></i> WhatsApp</template>
            <template #content><p>+62 812-3456-7890</p></template>
          </Card>
          <Card class="contact-card card-hover">
            <template #title
              ><i class="pi pi-compass"></i> Pusat Bantuan</template
            >
            <template #content
              ><p>
                Dokumentasi, FAQ lanjutan, dan panduan implementasi.
              </p></template
            >
          </Card>
        </div>
      </div>
    </section>

    <!-- Footer (existing) -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <span
            >© {{ new Date().getFullYear() }} Smart Attendance. All rights
            reserved.</span
          >
          <div class="footer-links">
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.bg-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.circle-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9) !important;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  animation: rotate 3s infinite ease-in-out;
}

@keyframes rotate {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.version-tag {
  font-size: 0.75rem;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-login {
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  border: none !important;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

/* Hero Section */
.hero-section {
  padding: 6rem 0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}
.hero-section.fade-in {
  opacity: 1;
  transform: translateY(0);
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}
.hero-content {
  animation: slideInLeft 1s ease;
}
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.hero-tag {
  display: inline-block;
  margin-bottom: 1.5rem;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #1a202c;
}
.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
}
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.hero-description {
  font-size: 1.125rem;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 2rem;
}
.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.btn-lg {
  padding: 0.875rem 2rem !important;
  font-size: 1rem !important;
}
.btn-outline {
  border: 2px solid #3b82f6 !important;
  color: #3b82f6 !important;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn-outline:hover {
  background: #3b82f6 !important;
  color: white !important;
  transform: translateY(-2px);
}
.hero-features {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
.feature-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
}
.feature-badge i {
  color: #3b82f6;
}

/* Hero Visual */
.hero-visual {
  animation: slideInRight 1s ease;
}
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.dashboard-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.floating {
  animation: floating 3s ease-in-out infinite;
}
@keyframes floating {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.stat-box {
  background: linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}
.stat-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.stat-1 {
  animation-delay: 0.1s;
}
.stat-2 {
  animation-delay: 0.2s;
}
.stat-3 {
  animation-delay: 0.3s;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.stat-label {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.5rem;
}
.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}
.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.slide-in {
  animation: slideIn 0.8s ease forwards;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.pulse-avatar {
  animation: pulse 2s infinite;
}
.activity-name {
  font-weight: 600;
  margin: 0;
  color: #1a202c;
}
.activity-time {
  color: #718096;
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  background: white;
  position: relative;
  z-index: 1;
}
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}
.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
}
.section-subtitle {
  font-size: 1.125rem;
  color: #718096;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.feature-card {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}
.feature-card:nth-child(1) {
  animation-delay: 0.1s;
}
.feature-card:nth-child(2) {
  animation-delay: 0.2s;
}
.feature-card:nth-child(3) {
  animation-delay: 0.3s;
}
.card-hover {
  height: 100%;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}
.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
}
.calendar-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}
.users-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
.chart-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}
.feature-desc {
  color: #718096;
  line-height: 1.7;
}

/* NEW: Usecases */
.usecases-section {
  padding: 6rem 0;
  background: white;
}
.usecase-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.usecase-card .bullet {
  color: #4a5568;
  line-height: 1.8;
  padding-left: 1rem;
}

/* Stats Section */
.stats-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  position: relative;
  z-index: 1;
}
.stats-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.stat-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem 2rem;
  border-radius: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: scaleIn 0.6s ease forwards;
  opacity: 0;
}
.stat-item:nth-child(1) .stat-card {
  animation-delay: 0.1s;
}
.stat-item:nth-child(2) .stat-card {
  animation-delay: 0.2s;
}
.stat-item:nth-child(3) .stat-card {
  animation-delay: 0.3s;
}
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.stat-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}
.stat-card-label {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1rem;
}
.stat-card-value {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

/* Testimonials Section */
.testimonials-section {
  padding: 6rem 0;
  background: white;
  position: relative;
  z-index: 1;
}
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}
.testimonial-card {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}
.testimonial-card:nth-child(1) {
  animation-delay: 0.1s;
}
.testimonial-card:nth-child(2) {
  animation-delay: 0.2s;
}
.testimonial {
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}
.testimonial::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
}
.quote-icon {
  font-size: 2rem;
  color: #3b82f6;
  opacity: 0.2;
  margin-bottom: 1rem;
}
.testimonial-text {
  font-size: 1.125rem;
  color: #1a202c;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}
.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.author-name {
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}
.author-role {
  color: #718096;
}

/* NEW: Integrations */
.integrations-section {
  padding: 6rem 0;
  background: white;
}
.logo-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.logo-chip {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* NEW: Security */
.security-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.security-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.security-card i {
  margin-right: 8px;
}

/* NEW: Pricing */
.pricing-section {
  padding: 6rem 0;
  background: white;
}
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.price-card {
  padding-bottom: 1rem;
}
.price-card.featured {
  border-color: #3b82f6;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
}
.price-tag {
  font-size: 2rem;
  font-weight: 800;
  margin: 0.5rem 0 1rem;
}
.price-tag span {
  font-size: 0.875rem;
  font-weight: 500;
  color: #718096;
}
.bullet {
  color: #4a5568;
  line-height: 1.8;
  padding-left: 1rem;
}
.w-100 {
  width: 100%;
}

/* FAQ Section */
.faq-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  z-index: 1;
}
.faq-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.faq-card {
  border-radius: 15px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.3s ease;
}
.faq-card:hover {
  transform: translateX(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.faq-answer {
  color: #718096;
  line-height: 1.7;
}
.cta-wrapper {
  text-align: center;
}

/* NEW: How it works */
.how-section {
  padding: 6rem 0;
  background: white;
}
.how-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.how-card .p-card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.step-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  font-weight: 700;
}

/* NEW: CTA Banner */
.cta-banner {
  padding: 3rem 0;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}
.cta-banner-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.cta-actions {
  display: flex;
  gap: 1rem;
}

/* NEW: Contact */
.contact-section {
  padding: 6rem 0;
  background: white;
}
.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.contact-card i {
  margin-right: 8px;
}

/* Footer */
.footer {
  padding: 2rem 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  position: relative;
  z-index: 1;
}
.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #718096;
  font-size: 0.875rem;
}
.footer-links {
  display: flex;
  gap: 2rem;
}
.footer-links a {
  color: #718096;
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-links a:hover {
  color: #3b82f6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .hero-title {
    font-size: 2rem;
  }
  .hero-buttons {
    flex-direction: column;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
  .usecase-grid {
    grid-template-columns: 1fr;
  }
  .security-grid {
    grid-template-columns: 1fr;
  }
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  .how-grid {
    grid-template-columns: 1fr;
  }
  .stats-wrapper {
    grid-template-columns: 1fr;
  }
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .contact-grid {
    grid-template-columns: 1fr;
  }
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .hero-features {
    flex-direction: column;
    gap: 1rem;
  }
  .nav-actions {
    gap: 0.5rem;
  }
  .section-title {
    font-size: 2rem;
  }
  .stat-card-value {
    font-size: 2.5rem;
  }
  .container {
    padding: 0 1rem;
  }
  .hero-section {
    padding: 3rem 0;
  }
  .features-section,
  .stats-section,
  .testimonials-section,
  .faq-section {
    padding: 3rem 0;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }
  .stat-value {
    font-size: 2rem;
  }
  .logo-text {
    font-size: 1rem;
  }
  .btn-lg {
    padding: 0.75rem 1.5rem !important;
    font-size: 0.875rem !important;
  }
}
</style>
