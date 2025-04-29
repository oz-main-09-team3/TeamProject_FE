function RowCard({ emojiSrc, headerText, bodyText, rightIcon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between w-full p-5 rounded-2xl shadow-md bg-gray-100 cursor-pointer hover:bg-gray-300 transition"
    >
      {/* 왼쪽: 이모지/아바타 + 텍스트 */}
      <div className="flex items-center gap-4">
        {/* 이모지 이미지 */}
        {emojiSrc && (
          <img
            src={emojiSrc}
            alt="Icon"
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        {/* 글자 부분 */}
        <div className="flex flex-col">
          <span className="text-base font-semibold text-gray-900">
            {headerText}
          </span>
          {bodyText && (
            <span className="text-xs text-gray-500">{bodyText}</span>
          )}
        </div>
      </div>

      {/* 오른쪽: 아이콘 */}
      {rightIcon && <div className="flex items-center">{rightIcon}</div>}
    </div>
  );
}

export default RowCard;
