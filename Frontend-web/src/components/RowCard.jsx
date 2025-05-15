function RowCard({ emojiSrc, headerText, bodyText, rightIcon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between w-full py-2 px-4 sm:py-3 sm:px-5 rounded-xl shadow-md cursor-pointer transition
        bg-lightBg hover:bg-lightYellow dark:bg-darkdark dark:hover:bg-darkBrown flex-shrink-0"
    >
      {/* 왼쪽: 이모지/아바타 + 텍스트 */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {emojiSrc && (
          <img
            src={emojiSrc}
            alt="Icon"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm sm:text-base font-semibold text-lighttext dark:text-darktext">
            {headerText}
          </span>
          {bodyText && (
            <span className="text-xs sm:text-sm text-gray-500 dark:text-darktext/70">
              {bodyText}
            </span>
          )}
        </div>
      </div>

      {/* 오른쪽: 아이콘 */}
      {rightIcon && <div className="flex items-center">{rightIcon}</div>}
    </div>
  );
}

export default RowCard;
