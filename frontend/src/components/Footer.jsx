import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <Sprout size={20} aria-hidden="true" />
          MelonKu
        </Link>
        <div className="flex flex-wrap gap-5 text-sm text-white/80">
          <Link to="/" className="hover:text-white footer-link">
            Beranda
          </Link>
          <Link to="/scan" className="hover:text-white footer-link">
            Scan
          </Link>
          <Link to="/panduan-penyakit" className="hover:text-white footer-link">
            Panduan Penyakit
          </Link>
        </div>
        <p className="text-sm text-white/70">© 2026 MelonKu AI.</p>
      </div>
    </footer>
  );
}
