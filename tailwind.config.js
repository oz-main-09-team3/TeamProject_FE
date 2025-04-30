/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 기존 배경
        lightBg: "#FFF6D8",
        darkBg: "#1D1006",
        brown900: "#361D1C",

        // 🎨 라이트 모드 색상
        lightYellow: "#FFE281",
        lightGold: "#FFC400",
        lighttext: "#4D4015",
        lightOrange: "#FF9D00",

        // 🎨 다크 모드 색상
        darktext: "#FBDAAC",
        darkOrange: "#FFB34A",
        darkBrown: "#895000",
        darkCopper: "#B56732",
        darkdark: "#36261B",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
