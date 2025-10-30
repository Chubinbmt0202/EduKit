// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        // PHẢI CÓ DÒNG NÀY: Quét tất cả các file .js, .ts, .jsx, .tsx trong thư mục src/
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}