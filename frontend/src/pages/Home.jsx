import { ArrowRight, Bot, Camera, CheckCircle2, FileImage, ScanLine, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ASSETS, diseases } from "../data.js";
import { motion, useReducedMotion } from "framer-motion";
import { handleRipple } from "../utils.js";

const steps = [
  {
    title: "Foto/Unggah",
    text: "Ambil foto daun melon secara langsung atau unggah gambar dari perangkat.",
    icon: Camera,
  },
  {
    title: "AI Analisis",
    text: "Model YOLOv8n membaca area daun dan mendeteksi kelas penyakit.",
    icon: Bot,
  },
  {
    title: "Hasil & Rekomendasi",
    text: "Lihat bounding box, confidence score, dan saran penanganan.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const scrollFadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <>
      <section className="bg-melon-gradient text-white overflow-hidden">
        <div className="container-page grid min-h-[calc(100vh-64px)] items-center gap-10 py-14 md:grid-cols-[1fr_0.9fr] md:py-16">
          <div>
            <motion.div
              initial={{ x: shouldReduceMotion ? 0 : -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"
            >
              <Sparkles size={16} aria-hidden="true" />
              Deteksi cepat berbasis YOLOv8n
            </motion.div>

            <h1 className="max-w-3xl font-heading text-3xl font-bold leading-tight md:text-5xl">
              <span className="block overflow-hidden py-1">
                <motion.span
                  initial={{ y: shouldReduceMotion ? 0 : "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                  className="block"
                >
                  Deteksi Penyakit Daun Melon
                </motion.span>
              </span>
              <span className="block overflow-hidden py-1">
                <motion.span
                  initial={{ y: shouldReduceMotion ? 0 : "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                  className="block"
                >
                  dengan Kecerdasan Buatan
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-5 max-w-2xl text-base leading-8 text-white/90 md:text-lg"
            >
              Lindungi tanaman lebih awal melalui analisis gambar yang ringkas, jelas, dan siap digunakan di kebun
              maupun greenhouse.
            </motion.p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
              >
                <Link
                  to="/scan"
                  onClick={handleRipple}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary shadow-card hover:bg-background btn-secondary-animate"
                >
                  Mulai Deteksi
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.4, ease: "easeOut" }}
              >
                <Link
                  to="/panduan-penyakit"
                  onClick={handleRipple}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-white/70 px-6 py-3 font-semibold text-white hover:bg-white/10 btn-secondary-animate"
                >
                  Lihat Panduan
                </Link>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ x: shouldReduceMotion ? 0 : 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="relative animate-float"
          >
            <img
              src={ASSETS.hero}
              alt="Ilustrasi AI menganalisis daun melon"
              className="aspect-[4/3] w-full rounded-card border-4 border-white/80 object-cover shadow-card"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-card bg-white/92 p-4 text-text-primary shadow-card backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-secondary">Status AI</p>
                  <p className="font-heading text-xl font-bold text-primary">Siap menganalisis</p>
                </div>
                <ScanLine className="text-primary" size={32} aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container-page">
          <motion.div
            variants={scrollFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-heading text-2xl font-bold md:text-3xl">Cara Kerja MelonKu</h2>
            <p className="mt-3 text-text-secondary">
              Alur sederhana dari foto daun hingga rekomendasi penanganan.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  variants={staggerItem}
                  key={step.title}
                  className="card border border-transparent p-6 text-center card-cara-kerja"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={30} aria-hidden="true" />
                  </div>
                  <p className="mb-2 font-heading text-lg font-bold">
                    {index + 1}. {step.title}
                  </p>
                  <p className="leading-7 text-text-secondary">{step.text}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-page">
          <motion.div
            variants={scrollFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-heading text-2xl font-bold md:text-3xl">Jenis Penyakit yang Dapat Dideteksi</h2>
            <p className="mt-3 text-text-secondary">
              Empat kelas utama sesuai model MelonKu YOLOv8n.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {diseases.map((disease) => (
              <motion.article
                variants={staggerItem}
                key={disease.id}
                className="card overflow-hidden border border-transparent card-jenis-penyakit"
              >
                <div className="overflow-hidden h-44 w-full">
                  <img src={disease.image} alt={disease.name} className="h-full w-full object-cover img-zoom" />
                </div>
                <div className="p-5">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${disease.badgeClass}`}>
                    {disease.status}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-bold">{disease.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{disease.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-primary py-16 text-white"
      >
        <div className="container-page text-center">
          <FileImage className="mx-auto mb-5" size={42} aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Siap Memeriksa Daun Melon?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">
            Unggah foto daun dan biarkan MelonKu membantu membaca kondisi tanaman Anda.
          </p>
          <Link
            to="/scan"
            onClick={handleRipple}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3 font-semibold text-primary shadow-card hover:bg-background btn-secondary-animate"
          >
            Mulai Deteksi Sekarang
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </motion.section>
    </>
  );
}

