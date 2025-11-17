import type { Config } from "tailwindcss";

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        persimmon: "#FF6050",
        rose: "#FF0E83",
        conflowerBlue: "#5677FC",
        electricViolet: "#9013FE",
        amber: "#FFC200",
        cabaret: "#D54262",
        cosmic: "#813867",
        bossanova: "#66336E",
        revolver: "#341539",
        caribbeanGreen: "#00CC99",
      },
    },
  },
  plugins: [],
} satisfies Config;
