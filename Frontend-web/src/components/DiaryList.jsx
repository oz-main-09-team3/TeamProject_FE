import { useLike } from "../hooks/useLike";
import DiaryCard from "./DiaryCard";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

/**
 * 일기 목록을 보여주는 컴포넌트
 * @param {Array} diaryList - 일기 목록 배열
 * @param {Function} setDiaryList - 일기 목록을 업데이트하는 함수
 * 
 * TODO: API 연동 후 실제 데이터로 교체
 * TODO: 날짜별 정렬 기능 추가
 */
export default function DiaryList({ diaryList, setDiaryList }) {
  const { handleLike, loadingId, animatingId } = useLike(diaryList, setDiaryList);
  const navigate = useNavigate();

  const handleDiaryClick = () => {
    navigate('/diary');
  };

  // 날짜별로 정렬 (최신순)
  const sortedDiaryList = [...diaryList].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-4">
      {sortedDiaryList.map((diary) => (
        <DiaryCard
          key={diary.id}
          diary={diary}
          onLike={handleLike}
          isLoading={loadingId === diary.id}
          isAnimating={animatingId === diary.id}
          onClick={handleDiaryClick}
        >
          <button
            onClick={(e) => handleLike(diary.id, e)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
            title={diary.liked ? "좋아요 취소" : "좋아요"}
            disabled={loadingId === diary.id}
          >
            <Heart
              className={`w-4 h-4 ${
                diary.liked ? "fill-red-500 text-red-500" : "text-lighttext dark:text-darktext"
              }`}
            />
          </button>
        </DiaryCard>
      ))}
    </div>
  );
} 