import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import OnboardingModal from "./components/OnboardingModal.jsx";
import Home from "./pages/Home.jsx";
import PanduanPenyakit from "./pages/PanduanPenyakit.jsx";
import Scan from "./pages/Scan.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary font-body">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/panduan-penyakit" element={<PanduanPenyakit />} />
        </Routes>
      </main>
      <Footer />
      <OnboardingModal />
    </div>
  );
}
