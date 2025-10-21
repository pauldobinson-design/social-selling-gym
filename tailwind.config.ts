// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        accent: "#F59E0B",
        success: "#10B981",
        error: "#EF4444",
        ink: {
          900: "#0F172A",
          700: "#334155",
          500: "#64748B",
          300: "#CBD5E1",
          100: "#E2E8F0"
        }
      },
      borderRadius: {
        xl: "12px"
      },
      boxShadow: {
        card: "0 6px 20px rgba(2, 6, 23, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
