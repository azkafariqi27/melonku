/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        "primary-dark": "#1B5E20",
        "primary-light": "#81C784",
        accent: "#FFC107",
        error: "#D32F2F",
        success: "#43A047",
        background: "#F1F8E9",
        surface: "#FFFFFF",
        "text-primary": "#1B1B1B",
        "text-secondary": "#6B6B6B",
        border: "#C8E6C9",
        warning: "#FFF8E1",
        "warning-text": "#A0522D",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 24px rgba(46, 125, 50, 0.12)",
      },
      maxWidth: {
        container: "1200px",
      },
      backgroundImage: {
        "melon-gradient": "linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)",
      },
    },
  },
  plugins: [],
};
