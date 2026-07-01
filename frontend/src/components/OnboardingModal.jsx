import { ArrowRight, Bot, Camera, CheckCircle2, Sprout, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { handleRipple } from "../utils.js";

const STORAGE_KEY = "melonku_onboarding_seen";

const slides = [
  {
    icon: Sprout,
    title: "Selamat Datang di MelonKu",
    text: "Asisten AI untuk membantu mengenali kondisi daun melon dengan cepat dari foto.",
  },
  {
    icon: Camera,
    title: "Foto, Unggah, Analisis",
    text: "Ambil gambar daun yang jelas, lalu biarkan YOLOv8 membaca pola penyakit pada area daun.",
  },
  {
    icon: CheckCircle2,
    title: "Siap Memulai?",
    text: "Dapatkan hasil deteksi, skor keyakinan, dan rekomendasi penanganan dalam satu tampilan.",
  },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const slide = slides[index];
  const Icon = slide.icon;

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      setVisible(true);
    }
  }, []);

  function close() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  function changeSlide(newIndex) {
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  }

  function primaryAction() {
    if (index < slides.length - 1) {
      changeSlide(index + 1);
      return;
    }

    close();
    navigate("/scan");
  }

  const slideVariants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : (dir > 0 ? 100 : dir < 0 ? -100 : 0),
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : (dir < 0 ? 100 : dir > 0 ? -100 : 0),
      opacity: 0,
    }),
  };

  const isLastSlide = index === slides.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-6"
        >
          <motion.section
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-card bg-white p-6 shadow-card"
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-background text-text-secondary hover:text-primary transition-colors"
              onClick={close}
              aria-label="Lewati onboarding"
            >
              <X size={18} />
            </button>

            <div className="min-h-[220px] flex flex-col justify-center overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="text-center"
                >
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={38} aria-hidden="true" />
                  </div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-sm font-semibold text-primary">
                    <Bot size={16} aria-hidden="true" />
                    MelonKu AI
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-text-primary">{slide.title}</h2>
                  <p className="mt-3 leading-7 text-text-secondary">{slide.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-7 flex items-center justify-center gap-2">
              {slides.map((item, dotIndex) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Slide ${dotIndex + 1}`}
                  onClick={() => changeSlide(dotIndex)}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none ${
                    dotIndex === index ? "w-6 bg-primary" : "w-2 bg-border hover:bg-primary-light"
                  }`}
                />
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                className="rounded-lg px-4 py-3 font-semibold text-text-secondary btn-secondary-animate"
                onClick={(e) => {
                  handleRipple(e);
                  close();
                }}
              >
                Lewati
              </button>
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white shadow-card ${
                  isLastSlide ? "btn-primary-animate animate-pulse-button" : "btn-primary-animate"
                }`}
                onClick={(e) => {
                  handleRipple(e);
                  primaryAction();
                }}
              >
                {isLastSlide ? "Mulai Deteksi" : "Lanjut"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

