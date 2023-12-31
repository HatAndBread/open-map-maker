/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    darkTheme: "myDark",
    themes: [{
      light: {
        primary: "#d8b4fe",
        secondary: "#67e8f9",
        accent: "#fde047",
        neutral: "#4b5563",
        "base-100": "#ffffff",
        info: "#22d3ee",
        success: "#22c55e",
        warning: "#fb923c",
        error: "#f43f5e",
      },
      myDark: {
        primary: "#d8b4fe",
        secondary: "#67e8f9",
        accent: "#fde047",
        neutral: "#bbb",
        "base-100": "#1f2937",
        info: "#22d3ee",
        success: "#22c55e",
        warning: "#fb923c",
        error: "#f43f5e",
      },
    }],
  },
  plugins: [require("daisyui")],
};
