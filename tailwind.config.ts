import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#06080d",
          900: "#0a0f18",
          850: "#0e1520",
          800: "#141c28",
          700: "#1c2736",
          600: "#2a394d",
          500: "#3d5168",
          400: "#5b718a",
          300: "#8fa3bb",
          200: "#c5d2e0",
        },
        volt: {
          DEFAULT: "#22d3ee",
          dim: "#0891b2",
          glow: "#67e8f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        volt: "0 0 0 1px rgba(34, 211, 238, 0.35), 0 0 32px rgba(34, 211, 238, 0.12)",
        panel: "0 12px 40px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
