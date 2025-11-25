// packages/frontend/tailwind.config.cjs
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}",
      // include shared packages if you have them:
      "../**/packages/**/components/**/*.{js,ts,jsx,tsx}",
      "../**/packages/**/src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        // use the CSS variable set by next/font
        fontFamily: {
          sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
        },
        // you can add custom colors here if needed
      },
    },
    plugins: [],
  };
  