import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Command-center (app) palette
        ink: {
          950: "#070b16",
          900: "#0b1120",
          850: "#0e1526",
          800: "#121a2e",
          700: "#1b2540",
          600: "#273350",
        },
        gold: {
          DEFAULT: "#c9a24b",
          soft: "#d9bd7a",
          deep: "#a9842f",
        },
        electric: {
          DEFAULT: "#3d8bff",
          soft: "#6fa8ff",
        },
        // Report (ivory) palette
        ivory: {
          DEFAULT: "#f7f3ea",
          50: "#fbf9f2",
          100: "#f5efe1",
          200: "#ece3cf",
        },
        navy: {
          DEFAULT: "#14213d",
          900: "#0d1733",
          800: "#1c2c4f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(0,0,0,0.06), 0 12px 40px -12px rgba(0,0,0,0.45)",
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        report: "0 30px 80px -30px rgba(20,33,61,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
