function RowCard({ emojiSrc, headerText, bodyText, rightIcon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-lg shadow-md bg-white dark:bg-black cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {/* 왼쪽: 이모지/아바타 + 텍스트 */}
      <div className="flex items-center gap-3">
        {/* 이모지 이미지 */}
        {emojiSrc && (
          <img
            src={emojiSrc}
            alt="Icon"
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        {/* 글자 부분 */}
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {headerText}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {bodyText}
          </span>
        </div>
      </div>

      {/* 오른쪽: 아이콘 (좋아요/공유 등) */}
      {rightIcon && <div className="flex items-center">{rightIcon}</div>}
    </div>
  );
}

export default RowCard;
