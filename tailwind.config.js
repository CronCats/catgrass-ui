/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  presets: [require("./src/tailwind/config")],
};

module.exports = tailwindConfig;
