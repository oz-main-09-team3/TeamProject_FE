import { useParams, useNavigate } from "react-router-dom";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";
import RowCard from "../components/RowCard";
import { Heart } from "lucide-react";
import { useFriendDiaries } from "../hooks/useFriendDiaries";
import { useFriendInfo } from "../hooks/useFriendInfo";

/**
 * 친구의 일기 캘린더를 보여주는 페이지 컴포넌트
 * 친구의 공개된 일기 목록을 캘린더 형태로 표시하고,
 * 일기 목록을 보여주며 좋아요 기능을 제공합니다.
 */
function FriendCalendarPage() {
  const { friendId } = useParams(); // URL에서 친구 ID 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅
  
// 친구의 일기 관련 상태와 핸들러 가져오기
const {
    diaryList, // 전체 일기 목록
    filteredDiaryList, // 필터링된 일기 목록
    selectedDate, // 선택된 날짜
    emotionMap, // 감정 정보 매핑
    loadingId, // 좋아요 처리 중인 일기 ID
    isLoading: isDiaryLoading, // 로딩 상태
    error: diaryError, // 에러 상태
    handleDateClick, // 날짜 클릭 핸들러
    handleLike, // 좋아요 처리 핸들러
    getEmojiSrc, // 이모지 URL 가져오기
  } = useFriendDiaries(friendId);

  // 친구 정보 관련 상태 가져오기
  const { friendInfo, error: friendError } = useFriendInfo(friendId);

  /**
   * 날짜 문자열을 포맷팅하는 함수
   * @param {string} dateString - 날짜 문자열
   * @returns {string} 포맷팅된 날짜 문자열
   */
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  // 로딩 중일 때 표시할 UI
  if (isDiaryLoading) {
    return (
      <main className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-2xl text-lighttext dark:text-darktext">일기를 불러오는 중...</div>
      </main>
    );
  }

  // 에러 발생 시 표시할 UI
  if (diaryError || friendError) {
    return (
      <main className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-2xl text-red-500">{diaryError || friendError}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
      <section className="mx-auto max-w-5xl w-full m-8 section-container border bg-yl100/90 dark:bg-darkBg/50 border-lightGold dark:border-darkCopper rounded-xl">
        {/* 친구 정보 헤더 */}
        {friendInfo && (
          <div className="p-4 text-center border-b border-lightGold dark:border-darkCopper">
            <h2 className="text-xl font-semibold text-lighttext dark:text-darktext">
              {friendInfo.nickname || friendInfo.username}님의 일기
            </h2>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-3 items-stretch justify-center">
          {/* 캘린더 섹션 */}
          <div className="w-full lg:w-2/3 bg-yl100 dark:bg-darkBg rounded-lg shadow-md">
            <div className="aspect-[5/6] p-2 sm:p-4 flex items-center justify-center overflow-visible w-full h-full">
              <MonthlyCalendar 
                diaries={diaryList}
                emotionMap={emotionMap}
                onDateClick={handleDateClick}
              />
            </div>
          </div>

          {/* 일기 목록 섹션 */}
          <div className="w-full lg:w-1/2 flex flex-col gap-2 rounded-lg">
            {/* 선택된 날짜 표시 */}
            {selectedDate && (
              <div className="p-3 bg-lightBg dark:bg-darkBg rounded-lg shadow mb-2">
                <p className="text-sm text-lighttext dark:text-darktext">
                  {selectedDate}의 일기를 보고 있습니다.
                  <button
                    onClick={() => handleDateClick(selectedDate)}
                    className="ml-2 text-blue-600 dark:text-blue-400 underline"
                  >
                    전체 보기
                  </button>
                </p>
              </div>
            )}
            
            {/* 일기 목록 */}
            {filteredDiaryList.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {selectedDate ? "선택한 날짜에 작성된 일기가 없습니다." : "아직 작성된 일기가 없습니다."}
              </div>
            ) : (
              filteredDiaryList.map((diary) => {
                const emojiPath = getEmojiSrc(diary);
                return (
                  <div key={diary.id}>
                    <RowCard
                      emojiSrc={emojiPath}
                      headerText={diary.body.substring(0, 40) + "..."}
                      bodyText={formatDate(diary.createdAt)}
                      rightIcon={
                        <button
                          className="text-2xl"
                          onClick={(e) => handleLike(diary.id, e)}
                          disabled={loadingId === diary.id}
                          style={{ opacity: loadingId === diary.id ? 0.5 : 1 }}
                        >
                          <Heart
                            className={`w-6 h-6 ${
                              diary.liked
                                ? "fill-red-500 text-red-500"
                                : "text-lighttext dark:text-darktext"
                            }`}
                          />
                        </button>
                      }
                      onClick={() => navigate("/friend-diary", { 
                        state: { 
                          friendId: friendId,
                          diaryId: diary.id 
                        } 
                      })}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default FriendCalendarPage; 