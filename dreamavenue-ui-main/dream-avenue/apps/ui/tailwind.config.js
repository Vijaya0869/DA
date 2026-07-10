
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode:'class',
  theme: {
    extend: {
      colors: {
        bgColor:'var(--bgColor)',
        bgMenuHover:'var(--bgMenuHover)' 
      }
    }
  },
  plugins: [],
};

export default config;