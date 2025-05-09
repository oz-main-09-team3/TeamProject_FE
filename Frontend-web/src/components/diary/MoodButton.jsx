import React from 'react';

/**
 * 기분 선택 버튼 컴포넌트
 * 사용자가 현재 기분을 선택할 수 있는 버튼을 렌더링합니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.mood - 현재 선택된 기분 값
 * @param {string} props.value - 버튼이 나타내는 기분 값
 * @param {Function} props.onClick - 버튼 클릭 시 실행될 콜백 함수
 * @returns {JSX.Element} 기분 선택 버튼 컴포넌트
 */
const MoodButton = ({ mood, value, onClick }) => {
  const isSelected = mood === value;

  return (
    <button
      onClick={() => onClick(value)}
      className={`w-full h-12 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
        ${mood === value
          ? 'bg-lightYellow dark:bg-darkCopper text-darkBrown dark:text-darktext scale-105'
          : 'bg-gray-100 text-gray-700 dark:text-gray-700 hover:bg-lightYellow/40 dark:hover:bg-darkCopper/30'
        }`}
    >
      {value}
    </button>
  );
};

export default MoodButton; 