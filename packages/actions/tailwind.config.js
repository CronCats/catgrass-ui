/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: ['./**/*.{js,jsx,ts,tsx}', '../{ui,state}/**/*.{js,jsx,ts,tsx}'],
  presets: [require('@croncat-ui/ui/tailwind/config')],
}

module.exports = tailwindConfig
