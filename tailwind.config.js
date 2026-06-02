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
        // Krystal starter palette — refine in /docs/ during Phase 2
        cream: "#FAF7F2",
        ink: "#1F1F23",
        muted: "#6B6F76",
        accent: "#7B8FA1"
      }
    }
  },
  plugins: []
};
