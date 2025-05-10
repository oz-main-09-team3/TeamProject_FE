import RowCard from "./RowCard";
import { Heart } from "lucide-react";

/**
 * 일기 카드 컴포넌트
 * @param {Object} diary - 일기 데이터
 * @param {Function} onLike - 좋아요 처리 함수
 * @param {boolean} isLoading - 로딩 상태
 * @param {boolean} isAnimating - 애니메이션 상태
 * @param {Function} onClick - 카드 클릭 처리 함수
 */
export default function DiaryCard({ diary, onLike, isLoading, isAnimating, onClick }) {
  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const handleLike = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    onLike(diary.id, e);
  };

  return (
    <div key={diary.id}>
      <RowCard
        emojiSrc="/profile.png"
        headerText={`${diary.header}  ${diary.body}`}
        bodyText={diary.date ? formatDate(diary.date) : ''}
        rightIcon={
          <button
            onClick={handleLike}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
            title={diary.liked ? "좋아요 취소" : "좋아요"}
            disabled={isLoading}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                diary.liked || isAnimating
                  ? "fill-red-500 text-red-500 scale-115" 
                  : "text-lighttext dark:text-darktext"
              }`}
            />
          </button>
        }
        onClick={() => onClick(diary)}
      />
    </div>
  );
} 