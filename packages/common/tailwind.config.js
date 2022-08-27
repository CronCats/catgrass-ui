/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: [
    './**/*.{js,jsx,ts,tsx}',
    '../{ui,state,actions}/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('@croncat-ui/ui/tailwind/config')],
}

module.exports = tailwindConfig
