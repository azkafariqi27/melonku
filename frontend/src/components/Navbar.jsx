import { Menu, Sprout, X } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Beranda", to: "/" },
  { label: "Scan", to: "/scan" },
  { label: "Panduan Penyakit", to: "/panduan-penyakit" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white shadow-lg" : "bg-white/95 shadow-card backdrop-blur"
    }`}>
      <nav className="container-page flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary transition-transform duration-200 hover:scale-105">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Sprout size={20} aria-hidden="true" />
          </span>
          MelonKu
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-semibold transition-colors duration-250 ${
                  isActive
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "text-text-secondary hover:text-primary nav-link-underline"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <div className="container-page flex flex-col py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-2 py-3 font-semibold transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-text-secondary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

