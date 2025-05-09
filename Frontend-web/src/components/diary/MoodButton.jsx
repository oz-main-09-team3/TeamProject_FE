import React from 'react';

/**
 * 감정 선택 버튼 컴포넌트
 * @param {Object} props
 * @param {string} props.text - 버튼에 표시될 감정 텍스트
 * @param {boolean} props.isSelected - 현재 선택된 감정인지 여부
 * @param {Function} props.onClick - 버튼 클릭 시 실행될 함수
 * @returns {JSX.Element} 감정 선택 버튼
 */
const MoodButton = ({ text, isSelected, onClick }) => (
  <button
    className={`
      py-1 px-2 text-sm h-12 w-full rounded-md flex items-center justify-center transition-colors
      ${
        isSelected
          ? "bg-lightOrange text-white dark:text-darkBrown border-2 border-lightGold dark:bg-darkOrange dark:border-darktext"
          : "bg-lightYellow text-lighttext hover:bg-lightGold dark:bg-[#FBDAAC] dark:text-darkBrown dark:hover:text-darktext dark:hover:bg-darkCopper"
      }
    `}
    onClick={onClick}
    style={{ wordBreak: "keep-all", whiteSpace: "normal", lineHeight: "1.2" }}
  >
    {text}
  </button>
);

export default MoodButton; 