# Attendance Web (Vue 3 + Vite + PrimeVue + Tailwind)

Aplikasi web dashboard untuk manajemen absensi karyawan.  
Dibangun menggunakan **Vue 3**, **Vite**, **PrimeVue**, **Pinia**, **ApexCharts**, dan **TailwindCSS**.

## 🚀 Features

- **Manajemen Pengguna**
  - Tambah, hapus, dan filter pengguna berdasarkan nama/peran.
  - Ekspor data pengguna ke **Excel**.
- **Manajemen Absensi**
  - Lihat data absensi per karyawan.
  - Filter berdasarkan rentang tanggal dan karyawan.
  - Ekspor data absensi ke **Excel**.
- **Manajemen Cuti**
  - Approve/decline cuti karyawan secara langsung.
  - Filter cuti berdasarkan tanggal, karyawan, dan status.
  - Ekspor data cuti ke **Excel**.
- **Dashboard**
  - Statistik karyawan, absensi, cuti, dan sesi aktif.
  - Grafik absensi (7 hari terakhir) & distribusi cuti.
  - Aktivitas terbaru karyawan.

## 📦 Tech Stack

- **Frontend**: [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- **UI Components**: [PrimeVue](https://primevue.org/), [PrimeFlex](https://primeflex.org/), [TailwindCSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Charts**: [ApexCharts](https://apexcharts.com/)
- **Export Excel**: [xlsx](https://www.npmjs.com/package/xlsx)

## 🔗 Related Repositories

- **Backend Service (Express + MongoDB)**  
  👉 [attendance-service](https://github.com/viraalfita/attendance-service)

- **Mobile App (Flutter)**  
  👉 [attendance (Mobile)](https://github.com/viraalfita/attendance)

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/<username>/attendance-web.git
cd attendance-web
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di:

```
http://localhost:5173
```

### 4. Build untuk Production

```bash
npm run build
```

## 🔧 Konfigurasi API

Secara default, web ini terhubung ke service Express (`attendance-service`).
Ubah `baseUrl` API di file `src/api/api.js` sesuai dengan alamat backend kamu, contoh:

```js
// src/api/api.js
export const baseUrl = "http://localhost:5001/api";
```

## 📸 Screenshots

<img width="1390" height="815" alt="image" src="https://github.com/user-attachments/assets/97b9134f-6d94-405c-b788-901a12fb7c91" />


---

## 👤 Author

Developed by **Vira Alfita Yunia**
Part of integrated system: **Web Dashboard + Express Backend + Mobile Flutter Attendance**

