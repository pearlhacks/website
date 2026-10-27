import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Caviar Dreams", "system-ui"],
      body: ["Proxima Nova", "system-ui"],
    },
    extend: {
      backgroundImage: {
        landing: "url(/images/landing/PH2026_WebsiteLanding.svg')",
      },
      keyframes: {
        // Slides a track made of two identical halves along by one half, so
        // the loop is seamless.
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        // Lifts a line of text into place, for text that changes.
        rise: {
          from: { opacity: "0", transform: "translateY(0.25em)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        rise: "rise 0.3s ease-out",
      },
      colors: {
        // Primary brand colors - browns
        brown: {
          DEFAULT: "#5d2516", // Primary dark brown text
          light: "#ca8d5c", // Light brown for accents/buttons
          footer: "#cb915c", // Footer text color
          dark: "#6D2A1B", // Dark brown for About section background
          medium: "#B2652B", // Medium brown for "brew with" text
        },
        // Secondary brand colors - pinks
        pink: {
          DEFAULT: "#E57794", // Primary pink for headings
          light: "#ff99bb", // Light pink for accents
          soft: "#FAE3E1", // Soft pink background
          accent: "#f18e87", // Pink accent color
          transition: "#DE6F67", // Pink transition/darker shade
        },
        // Accent colors - blues
        blue: {
          DEFAULT: "#7ac0e6", // Primary blue for buttons
          light: "#9ccce6", // Light blue for links
          hover: "#7fb8d8", // Blue hover state
        },
        // Background colors - creams
        cream: {
          DEFAULT: "#fbe8ca", // Primary cream background
          light: "#fffbf7", // Light cream for cards
        },
        // Utility colors
        green: {
          DEFAULT: "#96b548", // Kept for future use
        },
        // PH27 "Post Office" palette, sampled from the Dot mascot art. Used by
        // the homepage; other pages still use the colors above.
        postal: {
          navy: {
            light: "#34508c",
            DEFAULT: "#233a6a", // Stamp border, hat, text
            dark: "#182a50",
          },
          blue: {
            light: "#aac6ec",
            DEFAULT: "#93b5e5", // Hat brim, mailbag
            dark: "#7a9fd6",
          },
          sky: {
            DEFAULT: "#ddebfb", // Stamp background
            dark: "#c6dbf4", // Dot's shadow
          },
          red: {
            DEFAULT: "#d54c5c", // Bandana
            dark: "#b23a49",
          },
          // Dot's fur, used as a manila envelope
          tan: {
            light: "#fbe9c6",
            DEFAULT: "#f5d9a4",
            dark: "#e3bc7e",
            deep: "#c99a5b",
          },
          paper: "#fffdf8", // Letters
        },
      },
    },
  },
  plugins: [],
};
export default config;
