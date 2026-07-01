import {
  AlertCircle,
  Bot,
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  RefreshCw,
  ScanLine,
  Sprout,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDiseaseByName } from "../data.js";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { handleRipple } from "../utils.js";

const BOX_COLORS = {
  "Daun Sehat": "#43A047",
  "Layu Fusarium": "#D32F2F",
  "Keriting Daun": "#FFC107",
  "Bercak Kuning": "#FFC107",
};

function ConfidenceCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(Math.round(value * 100));
      return;
    }
    let start = 0;
    const end = Math.round(value * 100);
    if (start === end) {
      setCount(end);
      return;
    }
    
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, duration, shouldReduceMotion]);

  return <span>{count}%</span>;
}


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Scan() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confidence, setConfidence] = useState(0.5);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width < 768;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageLoad = (e) => {
    setNaturalSize({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
  };

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const topDetection = useMemo(() => {
    if (!result?.hasil?.length) return null;
    return [...result.hasil].sort((a, b) => b.confidence - a.confidence)[0];
  }, [result]);

  const disease = topDetection ? getDiseaseByName(topDetection.kelas) : null;
  const resultImage = result?.gambar_hasil
    ? `data:image/jpeg;base64,${result.gambar_hasil.replace(/^data:image\/[a-z]+;base64,/, "")}`
    : "";

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  function selectFile(nextFile) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    setFile(nextFile);
    setResult(null);
    setError("");
  }

  function clearImage() {
    setFile(null);
    setResult(null);
    setError("");
    setNaturalSize({ width: 0, height: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  async function analyzeImage() {
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    const body = new FormData();
    body.append("file", file);
    body.append("confidence", String(confidence));

    try {
      const response = await fetch(`${API_URL}/deteksi`, {
        method: "POST",
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Analisis gagal dijalankan.");
      }

      setResult(data);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Tidak dapat menghubungi server deteksi.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function openCamera() {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch {
      setCameraError("Kamera tidak dapat diakses. Anda tetap bisa memilih gambar dari perangkat.");
      cameraInputRef.current?.click();
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function closeCamera() {
    stopCamera();
    setCameraOpen(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const capturedFile = new File([blob], `melonku-camera-${Date.now()}.jpg`, { type: "image/jpeg" });
        selectFile(capturedFile);
        closeCamera();
      },
      "image/jpeg",
      0.92,
    );
  }

  return (
    <section className="py-10 md:py-14">
      <div className="container-page">
        <div className="mb-8">
          <p className="font-semibold text-primary">Scan Daun Melon</p>
          <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">Analisis Foto Daun</h1>
          <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
            Unggah foto daun yang jelas untuk mendapatkan hasil deteksi dan rekomendasi penanganan.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="card p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-heading text-xl font-bold">Upload Gambar</h2>
              {file && (
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
                  onClick={(e) => { handleRipple(e); clearImage(); }}
                  aria-label="Hapus gambar"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => selectFile(event.target.files?.[0])}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) => selectFile(event.target.files?.[0])}
            />

            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`flex min-h-[300px] w-full flex-col items-center justify-center rounded-card border-2 p-8 text-center transition-all-custom duration-300 ${
                  dragActive
                    ? "border-solid border-primary bg-primary/10 animate-pulse-border"
                    : "border-dashed border-primary bg-background hover:bg-primary/5"
                }`}
              >
                <UploadCloud className={`mb-4 text-primary ${dragActive ? "animate-bounce-icon" : ""}`} size={58} aria-hidden="true" />
                <span className="font-semibold text-text-primary">Seret & lepas gambar atau klik untuk memilih</span>
                <span className="mt-2 text-sm text-text-secondary">Format JPG, JPEG, atau PNG</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden rounded-card border border-border bg-background"
              >
                <img src={previewUrl} alt="Preview daun yang dipilih" className="max-h-[420px] w-full object-contain" />
                <button
                  type="button"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-error shadow-card hover:bg-error/10 transition-colors"
                  onClick={(e) => { handleRipple(e); clearImage(); }}
                  aria-label="Hapus preview"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}

            {cameraError && (
              <p className="mt-4 rounded-lg bg-warning px-4 py-3 text-sm font-semibold text-warning-text">
                {cameraError}
              </p>
            )}

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-light/25 px-5 py-3 font-semibold text-primary-dark hover:bg-primary-light/40 btn-secondary-animate"
                onClick={(e) => { handleRipple(e); openCamera(); }}
              >
                <Camera size={19} aria-hidden="true" />
                Gunakan Kamera
              </button>

              <label className="rounded-card bg-background p-4">
                <span className="flex items-center justify-between gap-4 text-sm font-semibold text-text-secondary">
                  Confidence
                  <span className="font-heading text-lg text-primary">{Math.round(confidence * 100)}%</span>
                </span>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={confidence}
                  onChange={(event) => setConfidence(Number(event.target.value))}
                  className="mt-3 w-full accent-primary"
                />
              </label>

              <AnimatePresence>
                {file && (
                  <motion.button
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                    transition={{ duration: 0.2 }}
                    type="button"
                    disabled={loading}
                    onClick={(e) => { handleRipple(e); analyzeImage(); }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white shadow-card btn-primary-animate"
                  >
                    {loading ? <Loader2 className="animate-spin" size={19} /> : <ScanLine size={19} />}
                    Analisis Sekarang
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </section>

          <section className="grid gap-6">
            <div className="card min-h-[360px] p-5 md:p-6 overflow-hidden">
              <h2 className="mb-5 font-heading text-xl font-bold">Hasil Deteksi</h2>

              {!loading && !result && !error && (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-card bg-background p-8 text-center">
                  <ImagePlus className="mb-4 text-primary" size={58} aria-hidden="true" />
                  <p className="font-semibold">Belum ada hasil analisis</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
                    Pilih foto daun terlebih dahulu, lalu tekan tombol Analisis Sekarang.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-card bg-background p-8 text-center">
                  <Sprout className="mb-4 animate-leaf-spin text-primary" size={58} aria-hidden="true" />
                  <p className="font-heading text-xl font-bold text-primary">
                    AI sedang menganalisis<span className="loading-dots"></span>
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">Model YOLOv8n membaca area daun pada gambar.</p>
                </div>
              )}

              {error && !loading && (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-card bg-error/10 p-8 text-center text-error">
                  <AlertCircle className="mb-4" size={54} aria-hidden="true" />
                  <p className="font-semibold">{error}</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Pastikan backend berjalan di {API_URL} dan gambar yang diunggah valid.
                  </p>
                </div>
              )}

              {result && !loading && (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: shouldReduceMotion ? 0 : (isMobile ? 0 : 40),
                    y: shouldReduceMotion ? 0 : (isMobile ? 40 : 0)
                  }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="grid gap-6 md:grid-cols-[1fr_0.85fr]"
                >
                  <div className="relative mx-auto overflow-hidden rounded-card border border-border bg-background w-full">
                    <img
                      src={previewUrl}
                      onLoad={handleImageLoad}
                      alt="Gambar hasil deteksi"
                      className="w-full h-auto block"
                    />
                    {naturalSize.width > 0 && result?.hasil && (
                      <svg
                        viewBox={`0 0 ${naturalSize.width} ${naturalSize.height}`}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      >
                        {result.hasil.map((det, index) => {
                          const [x1, y1, x2, y2] = det.bbox;
                          const w = x2 - x1;
                          const h = y2 - y1;
                          const color = BOX_COLORS[det.kelas] || "#2E7D32";
                          const perimeter = 2 * (w + h);
                          
                          // Calculate relative size for font size and label height based on image dimensions
                          const fontSize = Math.max(12, Math.round(naturalSize.width * 0.028));
                          const textPadding = Math.round(fontSize * 0.4);
                          const rectHeight = fontSize + textPadding * 1.5;
                          const rectWidth = det.kelas.length * (fontSize * 0.55) + Math.round(fontSize * 3);
                          const textY = Math.max(rectHeight - textPadding, y1 - textPadding);
                          const rectY = textY - fontSize - textPadding / 2;

                          return (
                            <g key={index}>
                              <motion.rect
                                x={x1}
                                y={y1}
                                width={w}
                                height={h}
                                fill="none"
                                stroke={color}
                                strokeWidth={Math.max(2, Math.round(naturalSize.width * 0.005))}
                                initial={{ strokeDasharray: perimeter, strokeDashoffset: perimeter }}
                                animate={{ strokeDashoffset: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                              <motion.g
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.3 }}
                              >
                                <rect
                                  x={x1}
                                  y={rectY}
                                  width={rectWidth}
                                  height={rectHeight}
                                  fill={color}
                                  rx={4}
                                />
                                <text
                                  x={x1 + 6}
                                  y={textY}
                                  fill="#ffffff"
                                  fontSize={fontSize}
                                  fontWeight="bold"
                                  fontFamily="Inter, sans-serif"
                                >
                                  {det.kelas} {Math.round(det.confidence * 100)}%
                                </text>
                              </motion.g>
                            </g>
                          );
                        })}
                      </svg>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    {topDetection ? (
                      <>
                        <motion.span
                          initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${disease?.badgeClass || "status-warning"}`}
                        >
                          {topDetection.kelas}
                        </motion.span>
                        <div className="mt-4 font-heading text-5xl font-bold text-primary">
                          <ConfidenceCounter value={topDetection.confidence} />
                          <span className="ml-2 text-xl text-text-primary">Yakin</span>
                        </div>
                        <p className="mt-4 leading-7 text-text-secondary">
                          {disease?.about || "Kondisi terdeteksi oleh model. Lihat rekomendasi untuk langkah berikutnya."}
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="w-fit rounded-full bg-background px-3 py-1 text-sm font-semibold text-text-secondary">
                          Tidak terdeteksi
                        </span>
                        <p className="mt-4 leading-7 text-text-secondary">
                          Model belum menemukan area daun atau gejala yang cukup jelas pada gambar ini.
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <article className="card p-6">
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <Bot size={20} aria-hidden="true" />
                    <h3 className="font-heading text-lg font-bold">Tentang Kondisi Ini</h3>
                  </div>
                  <p className="leading-7 text-text-secondary">
                    {disease?.about ||
                      "Belum ada kondisi spesifik yang terdeteksi. Gunakan foto yang lebih terang dan fokus pada daun."}
                  </p>
                </article>

                <article className="card p-6">
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <CheckCircle2 size={20} aria-hidden="true" />
                    <h3 className="font-heading text-lg font-bold">Rekomendasi Penanganan</h3>
                  </div>
                  <motion.ol
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="space-y-3"
                  >
                    {(disease?.recommendations || [result.rekomendasi]).map((item, index) => (
                      <motion.li
                        variants={{
                          hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
                          visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
                        }}
                        key={item}
                        className="flex gap-3 leading-6 text-text-secondary"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                        {item}
                      </motion.li>
                    ))}
                  </motion.ol>
                </article>

                <button
                  type="button"
                  onClick={(e) => { handleRipple(e); clearImage(); }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-white px-5 py-3 font-semibold text-primary hover:bg-primary/10 md:col-span-2 btn-secondary-animate"
                >
                  <RefreshCw size={18} aria-hidden="true" />
                  Analisis Gambar Lain
                </button>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
          >
            <motion.section
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9, y: shouldReduceMotion ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl rounded-card bg-white p-4 shadow-card"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold">Kamera</h2>
                <button
                  type="button"
                  onClick={(e) => { handleRipple(e); closeCamera(); }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-text-secondary"
                  aria-label="Tutup kamera"
                >
                  <X size={20} />
                </button>
              </div>
              <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full rounded-card bg-black object-cover" />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={(e) => { handleRipple(e); closeCamera(); }}
                  className="rounded-lg border border-primary px-5 py-3 font-semibold text-primary btn-secondary-animate"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={(e) => { handleRipple(e); capturePhoto(); }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white btn-primary-animate"
                >
                  <Camera size={18} aria-hidden="true" />
                  Ambil Foto
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
