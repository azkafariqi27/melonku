# MelonKu

MelonKu adalah aplikasi web deteksi penyakit daun melon berbasis AI menggunakan React, FastAPI, Tailwind CSS, dan model YOLOv8n.

## Menjalankan Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Health check tersedia di `http://localhost:8000/`.

## Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend akan memanggil API di `http://localhost:8000/deteksi`. Jika backend memakai URL berbeda, buat `.env.local` di folder `frontend`:

```bash
VITE_API_URL=http://localhost:8000
```
