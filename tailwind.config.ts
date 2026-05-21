import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "dark"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d9e8ff",
          200: "#bbd4ff",
          300: "#8ab8ff",
          400: "#5291f5",
          500: "#2d6be4",
          600: "#1a4fc9",
          700: "#1640a3",
          800: "#183684",
          900: "#1a3069",
          950: "#121f45",
        },
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        surface: {
          DEFAULT: "#ffffff",
          secondary: "#f8fafc",
          tertiary: "#f1f5f9",
          border: "#e2e8f0",
          "border-subtle": "#f1f5f9",
        },
        text: {
          primary: "#0f172a",
          secondary: "#475569",
          tertiary: "#94a3b8",
          inverse: "#ffffff",
          link: "#2d6be4",
        },
        status: {
          draft: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
          pending: { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
          approved: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          paid: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          failed: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
          active: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          inactive: { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
          suspended: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
          invited: { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
          deactivated: { bg: "#f8fafc", text: "#94a3b8", border: "#e2e8f0" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
        modal: "0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)",
        sidebar: "1px 0 0 0 #e2e8f0",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
        "slide-in-right": "slide-in-from-right 0.2s ease-out",
        "slide-in-left": "slide-in-from-left 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
