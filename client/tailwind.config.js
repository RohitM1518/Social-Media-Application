/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#a855f7",
          "secondary": "#64748b",
          "accent": "#d946ef",
          "neutral": "#191d24",
          "base-100": "#f3f4f6",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
          // Override gray colors here
          "gray": "#ffffff" // Example override
        },
      },
    ],
  },
}

