/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				tokpedFont: ["Open Sauce One", "sans-serif"],
				mandalaFont: ["Mandala"],
			},
		},
	},
	plugins: [require("flowbite/plugin")],
};
