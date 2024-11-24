/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Dark theme colors
          background: {
            DEFAULT: '#1C2631',
            dark: '#0F172A'
          },
          primary: {
            DEFAULT: '#3B82F6',
            dark: '#2563EB'
          },
          secondary: {
            DEFAULT: '#232D3F',
            dark: '#1E2632'
          },
          accent: {
            DEFAULT: '#6366F1',
            dark: '#4F46E5'
          }
        }
      }
    },
    plugins: [],
  }