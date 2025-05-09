import React from 'react';

/**
 * 일기 헤더 컴포넌트
 * @param {Function} onGoBack - 뒤로가기 핸들러
 * @returns {JSX.Element} 헤더 컴포넌트
 */
const DiaryHeader = ({ onGoBack }) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <button
        className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full text-lg w-10 h-10 flex items-center justify-center"
        onClick={onGoBack}
      >
        ←
      </button>
      <div className="flex space-x-2">
        <button className="p-2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button className="p-2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DiaryHeader; 