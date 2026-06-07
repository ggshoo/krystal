/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // krystal palette — warm cartoon-game vibe
        // Base
        cream: "#F7F0E5",   // warmer cream background
        ink: "#2D2520",     // warm dark brown for primary text
        muted: "#8A7E6F",   // warm taupe for secondary text
        accent: "#C2876B",  // soft terracotta CTA
        // Companion-adjacent (grape will land in v0.2)
        grape: "#9D7BC4",   // light purple — distinct from "fear" #8E6FB5
        // Soft surface for nested cards
        surface: "#FDF7EC"
      },
      borderRadius: {
        // Softer corners for a friendlier feel
        tile: "28px",
        chip: "999px"
      }
    }
  },
  plugins: []
};
