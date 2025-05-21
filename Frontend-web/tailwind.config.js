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
    
    // 캐럿 스타일 설정을 위한 커스텀 플러그인 추가
    function({ addBase }) {
      addBase({
        // 인풋 필드를 제외한 모든 텍스트 요소에 캐럿 숨기기
        'body, div, p, span, h1, h2, h3, h4, h5, h6, a, li, ul, ol, table, th, td, button, label': {
          caretColor: 'transparent',
        },
        // 입력 필드는 캐럿 표시 유지
        'input, textarea, [contenteditable="true"]': {
          caretColor: 'auto', // 또는 theme('colors.lighttext') 등으로 테마 컬러 사용 가능
        },
      });
    },
  ],
};