/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  // NativeWind 4 follows system color scheme via media query by default.
  // Use `dark:` prefix on classNames to opt into dark variants.
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        // krystal palette — warm cartoon-game vibe
        // ── Light mode ─────────────────────────────────────────────
        cream: "#F7F0E5",   // warm cream background
        ink: "#2D2520",     // warm dark brown for primary text
        muted: "#8A7E6F",   // warm taupe for secondary text
        accent: "#C2876B",  // soft terracotta CTA
        grape: "#9D7BC4",   // light purple companion
        surface: "#FDF7EC", // soft surface for nested cards

        // ── Dark mode (warm, not cold) ─────────────────────────────
        "cream-dark": "#1F1B16",     // very dark warm brown bg
        "ink-dark": "#F0E8DA",       // warm off-white text
        "muted-dark": "#9C9285",     // warm muted gray-taupe
        "accent-dark": "#D89E80",    // brighter terracotta for contrast
        "surface-dark": "#2A251E",   // warm dark surface for cards
        "border-dark": "#3A332A"     // warm dark border
      },
      borderRadius: {
        tile: "28px",
        chip: "999px"
      }
    }
  },
  plugins: []
};
