/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '0px',
      'sm': '475px',
      'md': '768px',
      'lg': '1280px',
      'xl': '1440px'
    },
    extend: {
      backgroundImage: {
        'background': "url('/images/background.png')"
      },
    },
  },
  plugins: [],
}
