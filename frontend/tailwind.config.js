/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rootBg: '#0b0d13',
        rootSidebar: '#0d1018',
        rootPanel: '#141824',
        rootPanel2: '#10131d',
        rootInput: '#0d111a',
        rootBorder: '#222838',
        rootBlue: '#2563eb',
        rootBlueLight: '#3b82f6',
        rootMuted: '#8f98aa',
      },
      boxShadow: {
        rootCard: '0 16px 40px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
};
