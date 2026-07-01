export const ASSETS = {
  hero: "/assets/hero-agritech.png",
  healthy: "/assets/daun-sehat.jpg",
  fusarium: "/assets/layu-fusarium.png",
  curl: "/assets/keriting-daun.png",
  yellow: "/assets/bercak-kuning.png",
};

export const diseases = [
  {
    id: "daun-sehat",
    name: "Daun Sehat",
    status: "Normal",
    badgeClass: "status-healthy",
    image: ASSETS.healthy,
    description:
      "Kondisi ideal daun melon yang menunjukkan pertumbuhan optimal tanpa indikasi penyakit.",
    about:
      "Daun sehat memiliki warna hijau merata, tulang daun jelas, dan permukaan segar. Kondisi ini menandakan tanaman mendapatkan air, nutrisi, dan cahaya yang cukup.",
    symptoms: ["Warna hijau merata", "Tekstur daun segar", "Tidak ada bercak atau kelayuan"],
    recommendations: [
      "Lanjutkan perawatan rutin",
      "Pantau kelembaban media tanam",
      "Periksa daun minimal 2x seminggu",
    ],
  },
  {
    id: "layu-fusarium",
    name: "Layu Fusarium",
    status: "Bahaya",
    badgeClass: "status-danger",
    image: ASSETS.fusarium,
    description:
      "Penyakit jamur tanah yang menyerang jaringan pembuluh tanaman dan menyebabkan kelayuan.",
    about:
      "Fusarium menghambat aliran air dan nutrisi, sehingga daun menguning, layu pada siang hari, dan tanaman dapat mati bila tidak segera ditangani.",
    symptoms: ["Daun menguning bertahap", "Tanaman layu pada siang hari", "Pangkal batang dapat kecokelatan"],
    recommendations: [
      "Cabut tanaman terinfeksi",
      "Perbaiki drainase lahan",
      "Aplikasikan fungisida sistemik Carbendazim",
    ],
  },
  {
    id: "keriting-daun",
    name: "Keriting Daun",
    status: "Waspada",
    badgeClass: "status-warning",
    image: ASSETS.curl,
    description:
      "Gangguan daun menggulung atau berubah bentuk, sering dipicu virus dan hama vektor.",
    about:
      "Keriting daun biasanya muncul bersama permukaan daun yang kasar, pertumbuhan terhambat, dan pucuk yang tidak normal akibat virus atau serangan kutu daun/thrips.",
    symptoms: ["Tepi daun menggulung", "Permukaan keriput", "Pertumbuhan pucuk terhambat"],
    recommendations: [
      "Kendalikan kutu daun dan thrips",
      "Gunakan mulsa plastik perak",
      "Pisahkan tanaman dengan gejala berat",
    ],
  },
  {
    id: "bercak-kuning",
    name: "Bercak Kuning",
    status: "Waspada",
    badgeClass: "status-warning",
    image: ASSETS.yellow,
    description:
      "Bercak klorotik pada daun yang dapat menjadi tanda awal jamur, kelembaban tinggi, atau masalah nutrisi.",
    about:
      "Bercak kuning perlu dipantau karena dapat menyebar dari daun bawah ke daun muda, terutama pada lingkungan greenhouse yang terlalu lembab.",
    symptoms: ["Bercak kuning tidak merata", "Daun bawah lebih dulu terdampak", "Area bercak dapat melebar"],
    recommendations: [
      "Kurangi kelembaban area tanam",
      "Aplikasikan fungisida Mankozeb",
      "Perbaiki sirkulasi udara greenhouse",
    ],
  },
];

export function getDiseaseByName(name) {
  return diseases.find((item) => item.name.toLowerCase() === String(name).toLowerCase());
}
