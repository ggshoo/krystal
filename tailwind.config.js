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
      // ── Fonts ────────────────────────────────────────────────────────────
      // Roboto everywhere — clean and neutral. `font-display` and `font-body`
      // both resolve to Roboto; weight is controlled by the font-weight
      // utilities. Loaded on native via @expo-google-fonts/roboto (see
      // app/_layout.tsx) and on web via app/+html.tsx <link>.
      fontFamily: {
        display: ["Roboto", "system-ui", "sans-serif"],
        body: ["Roboto", "system-ui", "sans-serif"]
      },
      colors: {
        // crystal palette — cozy storybook "little journey" vibe.
        // Warm inks on soft skies; terracotta + gold for chunky buttons.
        // ── Light mode (day scene) ─────────────────────────────────
        cream: "#FBF3E2",   // warm parchment background (fallback under scenes)
        ink: "#2E2416",     // deep warm bark brown for primary text
        muted: "#6B5B44",   // warm cocoa taupe for secondary text
        accent: "#E97451",  // terracotta CTA
        "accent-deep": "#B9502E", // terracotta button lip / pressed
        gold: "#E9B54A",    // sunlit gold CTA
        "gold-deep": "#B9862B",   // gold button lip
        grape: "#995DA6",   // grape companion purple
        "grape-deep": "#733F80",
        bark: "#6B4A32",    // wooden brown for outlines / ghost buttons
        leaf: "#5C8C48",    // hill / leaf green
        surface: "#FFFDF6", // soft card surface
        parchment: "#FFF6E3", // panel behind text on busy scenes

        // ── Dark mode (dusk / night scene) ─────────────────────────
        "cream-dark": "#221B2E",     // deep dusk plum bg
        "ink-dark": "#F5ECDA",       // warm off-white text
        "muted-dark": "#C9BBD4",     // soft lavender-taupe
        "accent-dark": "#F08A63",    // brighter terracotta for contrast
        "surface-dark": "#2E2740",   // dusk card surface
        "border-dark": "#463C57"     // dusk border
      },
      borderRadius: {
        tile: "22px",
        chunk: "18px",
        chip: "999px"
      }
    }
  },
  plugins: []
};
