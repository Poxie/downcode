/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './assets/icons/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        section: '120px',
      },
      backgroundColor: {
        'c-primary': '#1081B5',
        'c-secondary': '#178CC0',
        primary: '#0F172A',
        secondary: '#141C34',
        tertiary: '#1A2441',
        quaternary: '#1F2B4F',
      },
      textColor: {
        'c-primary': '#1081B5',
        'c-secondary': '#178CC0',
        primary: '#fff',
        'primary-accent': '#94A3B8',
        secondary: '#94A3B8',
        'secondary-accent': '#626D7C',
      },
      borderColor: {
        'c-primary': '#1081B5',
        'c-secondary': '#178CC0',
        primary: '#0F172A',
        secondary: '#141C34',
        tertiary: '#1A2441',
        quaternary: '#1F2B4F',
      },
      width: {
        main: '1200px',
      },
      maxWidth: {
        main: '90%',
      }
    },
  },
  plugins: [],
}
