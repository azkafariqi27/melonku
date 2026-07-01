import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { diseases } from "../data.js";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { handleRipple } from "../utils.js";

const tabs = ["Semua", ...diseases.map((item) => item.name)];

export default function PanduanPenyakit() {
  const [activeTab, setActiveTab] = useState("Semua");
  const shouldReduceMotion = useReducedMotion();

  const filteredDiseases = useMemo(
    () => (activeTab === "Semua" ? diseases : diseases.filter((item) => item.name === activeTab)),
    [activeTab],
  );

  return (
    <>
      <section className="bg-melon-gradient py-16 text-white md:py-20">
        <div className="container-page text-center">
          <h1 className="font-heading text-3xl font-bold md:text-4xl">Panduan Penyakit Daun Melon</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/90">
            Kenali gejala, pahami penyebab, dan ambil tindakan tepat untuk melindungi tanaman melon.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={(e) => {
                    handleRipple(e);
                    setActiveTab(tab);
                  }}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    isActive
                      ? "text-white"
                      : "border border-primary bg-white text-primary hover:bg-primary/10"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-primary rounded-full -z-10 shadow-card"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {tab}
                </button>
              );
            })}
          </div>

          <motion.div layout className="grid gap-6 lg:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredDiseases.map((disease) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={disease.id}
                  className="card grid overflow-hidden border border-transparent sm:grid-cols-[0.9fr_1.1fr] card-panduan-penyakit"
                >
                  <img src={disease.image} alt={disease.name} className="h-full min-h-64 w-full object-cover" />
                  <div className="flex flex-col p-6">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-heading text-xl font-bold">{disease.name}</h2>
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${disease.badgeClass}`}>
                        {disease.status}
                      </span>
                    </div>
                    <p className="leading-7 text-text-secondary">{disease.description}</p>

                    <div className="mt-5">
                      <h3 className="mb-2 font-semibold">Ciri-ciri visual</h3>
                      <ul className="space-y-2">
                        {disease.symptoms.map((symptom) => (
                          <li key={symptom} className="flex gap-2 text-sm leading-6 text-text-secondary">
                            <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={17} aria-hidden="true" />
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5">
                      <h3 className="mb-2 font-semibold">Rekomendasi penanganan</h3>
                      <ol className="space-y-2">
                        {disease.recommendations.map((item, index) => (
                          <li key={item} className="flex gap-2 text-sm leading-6 text-text-secondary">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {index + 1}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <Link
                      to="/scan"
                      onClick={handleRipple}
                      className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg border border-primary px-4 py-2.5 font-semibold text-primary hover:bg-primary/10 btn-secondary-animate"
                    >
                      <Search size={18} aria-hidden="true" />
                      Scan Daun Saya
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="bg-primary py-14 text-white">
        <div className="container-page text-center">
          <h2 className="font-heading text-2xl font-bold">Tidak yakin kondisi daun Anda?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Gunakan halaman Scan untuk mendapatkan hasil AI dan rekomendasi awal.
          </p>
          <Link
            to="/scan"
            onClick={handleRipple}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary hover:bg-background btn-secondary-animate"
          >
            Mulai Deteksi Sekarang
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}

