<div align="center">

<img src="https://img.shields.io/badge/MelonKu-Deteksi%20Penyakit%20Daun%20Melon-2E7D32?style=for-the-badge&logo=leaf&logoColor=white" alt="MelonKu" />

# 🍈 MelonKu
### Sistem Deteksi Penyakit Daun Melon Berbasis Kecerdasan Buatan

[![Live Demo](https://img.shields.io/badge/Live%20Demo-melonku.vercel.app-2E7D32?style=flat-square&logo=vercel&logoColor=white)](https://melonku.vercel.app/)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8n-AI%20Model-FF6F00?style=flat-square&logo=pytorch&logoColor=white)](https://ultralytics.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Tentang Proyek

**MelonKu** adalah aplikasi web berbasis kecerdasan buatan yang dirancang untuk membantu petani dan peneliti dalam mendeteksi penyakit pada daun tanaman melon secara cepat dan akurat. Cukup unggah foto daun, sistem AI akan menganalisis dan memberikan hasil deteksi beserta rekomendasi penanganan secara instan.

Proyek ini merupakan implementasi nyata (*deployment*) dari model **YOLOv8n** yang telah dilatih menggunakan dataset daun melon hasil harmonisasi dari dua sumber dataset berbeda dengan total **609 gambar** dan **4 kelas kondisi daun**.

> 🌐 **Live Demo:** [https://melonku.vercel.app/](https://melonku.vercel.app/)

---

## ✨ Fitur Utama

- 🔍 **Deteksi AI Real-time** — Upload foto daun dan dapatkan hasil deteksi dalam hitungan detik
- 📷 **Dua Mode Input** — Unggah dari galeri atau gunakan kamera perangkat langsung
- 📊 **Confidence Score** — Menampilkan tingkat keyakinan AI terhadap hasil deteksi
- 🖼️ **Bounding Box Visual** — Gambar hasil dilengkapi kotak deteksi pada area penyakit
- 💊 **Rekomendasi Penanganan** — Setiap hasil deteksi disertai langkah penanganan praktis
- 📚 **Panduan Penyakit** — Halaman referensi lengkap 4 kelas kondisi daun melon
- 📱 **Responsive Design** — Dapat diakses dari desktop maupun perangkat mobile
- ✨ **Animasi Interaktif** — Scroll animation, hover effects, dan transisi yang smooth

---

## 🤖 Model AI

| Atribut | Detail |
|---|---|
| **Arsitektur** | YOLOv8n (Nano) |
| **Framework** | Ultralytics YOLOv8 |
| **Jumlah Kelas** | 4 kelas |
| **Ukuran Input** | 416 × 416 px |
| **Epochs** | 15 |
| **mAP@50** | 86.3% |
| **Precision** | 88.2% |
| **Recall** | 78.7% |

### Kelas Deteksi

| ID | Kelas | Status | mAP@50 |
|---|---|---|---|
| 0 | Daun Sehat | 🟢 Normal | 98.5% |
| 1 | Layu Fusarium | 🔴 Bahaya | 93.6% |
| 2 | Keriting Daun | 🟠 Waspada | 54.5% |
| 3 | Bercak Kuning | 🟡 Waspada | 98.6% |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) — UI framework
- **Tailwind CSS** — Styling
- **Framer Motion** — Animasi & transisi
- **React Router** — Client-side routing

### Backend
- **FastAPI** (Python) — REST API framework
- **Ultralytics YOLOv8** — Inferensi model AI
- **Pillow** — Pemrosesan gambar
- **Uvicorn** — ASGI server

### Deployment
- **Vercel** — Frontend hosting
- **Railway** — Backend hosting

---

## 📁 Struktur Project

```
melonku/
├── frontend/                  ← React.js (Vite + Tailwind)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Halaman beranda
│   │   │   ├── Scan.jsx           # Halaman deteksi AI
│   │   │   └── PanduanPenyakit.jsx # Halaman panduan penyakit
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigasi utama
│   │   │   ├── Footer.jsx         # Footer
│   │   │   └── OnboardingModal.jsx # Modal perkenalan
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── backend/                   ← FastAPI (Python)
    ├── main.py                    # Entry point API
    ├── best.pt                    # Model YOLOv8n (file bobot)
    └── requirements.txt
```

---

## 🚀 Menjalankan Secara Lokal

### Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [Python](https://python.org/) 3.8 atau lebih baru
- [Git](https://git-scm.com/)

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/melonku.git
cd melonku
```

> Ganti `USERNAME` dengan username GitHub kamu.

### 2. Menjalankan Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend akan berjalan di: `http://localhost:8000`

Health check API: `http://localhost:8000/`

### 3. Menjalankan Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

### 4. Konfigurasi Environment (Opsional)

Jika backend berjalan di URL berbeda, buat file `.env.local` di folder `frontend`:

```bash
VITE_API_URL=http://localhost:8000
```

> ⚠️ Jangan commit file `.env.local` ke repository.

---

## 📡 API Endpoint

### Health Check
```
GET /
```
**Response:**
```json
{
  "status": "ok",
  "model": "MelonKu YOLOv8n"
}
```

### Deteksi Penyakit
```
POST /deteksi
Content-Type: multipart/form-data
```

**Parameter:**
| Field | Tipe | Wajib | Default | Keterangan |
|---|---|---|---|---|
| `file` | File (JPG/PNG) | ✅ | — | Foto daun yang akan dideteksi |
| `confidence` | float | ❌ | 0.5 | Threshold keyakinan (0.0 – 1.0) |

**Response:**
```json
{
  "jumlah_deteksi": 1,
  "hasil": [
    {
      "kelas": "Bercak Kuning",
      "confidence": 0.8731,
      "bbox": [120.5, 45.2, 310.8, 280.1]
    }
  ],
  "gambar_hasil": "base64_string...",
  "rekomendasi": "Kurangi kelembaban berlebih, aplikasikan fungisida Mankozeb..."
}
```

---

## 📸 Tampilan Aplikasi

| Halaman | Deskripsi |
|---|---|
| **Beranda** | Hero section, cara kerja, jenis penyakit yang dapat dideteksi |
| **Scan** | Upload foto / kamera, hasil deteksi AI, rekomendasi penanganan |
| **Panduan Penyakit** | Referensi lengkap 4 kelas kondisi daun melon |

---

## 📊 Dataset

Model dilatih menggunakan dataset hasil harmonisasi dari **2 sumber dataset** berbeda yang diperoleh dari Roboflow, dengan proses penyeragaman label (*label mapping*) secara otomatis menggunakan script Python.

| Split | Jumlah Gambar |
|---|---|
| Train | 426 |
| Validation | 122 |
| Test | 61 |
| **Total** | **609** |

---

## ⚠️ Catatan Penting

- File `best.pt` (bobot model YOLOv8n) **tidak disertakan** di repository ini karena ukurannya yang besar. Silakan hubungi author untuk mendapatkan file model.
- Jangan mempublikasikan URL backend (Railway) secara terbuka untuk mencegah penyalahgunaan resource.
- Rekomendasi penanganan penyakit yang ditampilkan bersifat panduan umum dan sebaiknya dikonsultasikan lebih lanjut dengan ahli pertanian/agronomis.

---

## 👤 Author

**Moh. Azka Fariqi**

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan penelitian dan pengembangan pribadi.
Tidak diperkenankan untuk digunakan secara komersial tanpa izin dari author.

---

<div align="center">

Dibuat dengan ❤️ untuk membantu petani melon Indonesia 🍈

[![Live Demo](https://img.shields.io/badge/Coba%20Sekarang-melonku.vercel.app-2E7D32?style=for-the-badge&logo=vercel&logoColor=white)](https://melonku.vercel.app/)

</div>
