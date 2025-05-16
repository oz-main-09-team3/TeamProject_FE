/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        // 기존 배경
        lightBg: "#FFF6D8",
        darkBg: "#1D1006",
        brown900: "#1B1410",
        yl100: "#FFFBEF",

        // 🎨 라이트 모드 색상
        lightYellow: "#FFE281",
        lightGold: "#FFC400",
        lighttext: "#4D4015",
        lightOrange: "#FF9D00",

        // 🎨 다크 모드 색상
        darktext: "#FFEED7",
        darkOrange: "#FFB34A",
        darkBrown: "#895000",
        darkCopper: "#B56732",
        darkdark: "#36261B",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("@tailwindcss/forms"), // 폼 요소 정돈
    require("@tailwindcss/typography"), // 프로즈 스타일링
    require("@tailwindcss/aspect-ratio"), // 비율 고정 (이미지/비디오)
  ],
};
