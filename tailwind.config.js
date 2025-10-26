/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./projects/collabwrite/src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
