import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink-rgb, 10 10 10) / <alpha-value>)",
        surface: "var(--color-surface, #131313)",
        surface2: "var(--color-surface2, #1a1a1a)",
        line: "var(--color-line, #242424)",
        paper: "rgb(var(--color-paper-rgb, 242 241 237) / <alpha-value>)",
        muted: "var(--color-muted, #8f9490)",
        mint: "rgb(var(--color-lime-rgb, 198 255 61) / <alpha-value>)",
        "mint-ink": "var(--color-lime-ink, #1c2600)",
        lime: "rgb(var(--color-lime-rgb, 198 255 61) / <alpha-value>)",
        "lime-ink": "var(--color-lime-ink, #1c2600)",
        teal: "var(--color-teal, #142805)",
      },
      fontFamily: {
        display: ["General Sans", "sans-serif"],
        body: ["Switzer", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        script: ["var(--font-script)", "cursive"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        "marquee-reverse": "marquee-reverse 26s linear infinite",
        "pulse-slow": "pulse 3.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      boxShadow: {
        glow: "0 0 60px -12px var(--color-lime-glow, rgba(198,255,61,0.45))",
        "glow-sm": "0 0 24px -8px var(--color-lime-glow, rgba(198,255,61,0.5))",
        "glow-lime": "0 0 24px -8px var(--color-lime-glow, rgba(198,255,61,0.55))",
      },
    },
  },
  plugins: [],
};
export default config;
