import React, { useEffect, useRef } from "react";
import RowCard from "../components/RowCard";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import useDiaryStore from "../store/diaryStore";
import useAuthStore from "../store/authStore";
import { getEmojiSrc } from "../utils/emojiUtils";
import { formatDate } from "../utils/dateUtils";
import { truncateText } from "../utils/textUtils";

function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const calendarContainerRef = useRef(null);
  const diaryContainerRef = useRef(null);
  
  // Zustand 스토어 사용
  const { 
    diaries, 
    filteredDiaries, 
    emotions, 
    selectedDate,
    isLoading, 
    error, 
    fetchDiaries, 
    fetchEmotions,
    setSelectedDate,
    toggleLike 
  } = useDiaryStore();
  
  const { isAuthenticated, fetchUserInfo } = useAuthStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        await fetchUserInfo();
        await Promise.all([
          fetchEmotions(),
          fetchDiaries()
        ]);
      } else {
        navigate('/login');
      }
    };
    
    loadData();
  }, [isAuthenticated, fetchUserInfo, fetchEmotions, fetchDiaries, navigate]);

  // 캘린더와 일기 목록 컨테이너 높이 동기화 - 제거 (고정 높이 사용)
  // useEffect(() => {
  //   const syncHeight = () => {
  //     if (calendarContainerRef.current && diaryContainerRef.current) {
  //       const calendarHeight = calendarContainerRef.current.offsetHeight;
  //       diaryContainerRef.current.style.height = `${calendarHeight}px`;
  //     }
  //   };

  //   syncHeight();
  //   window.addEventListener('resize', syncHeight);
  //   return () => window.removeEventListener('resize', syncHeight);
  // }, []);

  // location.state.refresh 값이 있으면 일기 목록 새로고침
  useEffect(() => {
    if (location.state?.refresh) {
      fetchDiaries();
    }
  }, [location.state, fetchDiaries]);

  const handleDateClick = (dateKey) => {
    setSelectedDate(dateKey);
  };

  // 일기를 최신순으로 정렬하는 함수
  const sortDiariesByDate = (diaries) => {
    return [...diaries].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // 정렬된 일기 목록
  const sortedDiaries = sortDiariesByDate(filteredDiaries);

  if (isLoading) {
    return (
      <main className="transition-colors duration-300">
        <div className="text-2xl text-lighttext dark:text-darktext">일기를 불러오는 중...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="transition-colors duration-300">
        <div className="text-2xl text-red-500">{error}</div>
      </main>
    );
  }

  // 일기 카드 하나의 예상 높이 (px) - RowCard의 높이에 따라 조정 필요
  const rowCardHeight = 72; // 일반적인 RowCard 높이(추정)
  const rowCardMargin = 8; // 카드 간 마진(space-y-2)
  const totalCardHeight = rowCardHeight + rowCardMargin;
  
  // 7개의 카드를 표시할 수 있는 높이 계산
  const maxVisibleCards = 7;
  const fixedDiaryHeight = (totalCardHeight * maxVisibleCards);

  return (
    <main className="transition-colors duration-300">
      <section className="mx-auto max-w-5xl w-full section-container border bg-yl100/90 dark:bg-darkBg/50 border-lightGold dark:border-darkCopper rounded-xl">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch justify-center p-2">
          <div ref={calendarContainerRef} className="w-full lg:w-2/3 bg-yl100 dark:bg-darkBg rounded-lg shadow-md">
            <div className="aspect-[5/6] p-2 sm:p-2 flex items-center justify-center overflow-visible w-full h-full">
              <MonthlyCalendar 
                diaries={diaries}
                emotionMap={emotions}
                onDateClick={handleDateClick}
              />
            </div>
          </div>

          <div ref={diaryContainerRef} className="w-full lg:w-1/2 flex flex-col gap-2 rounded-lg">
            {selectedDate && (
              <div className="p-3 bg-lightBg dark:bg-darkBg rounded-lg shadow">
                <p className="text-sm text-lighttext dark:text-darktext">
                  {selectedDate}의 일기를 보고 있습니다.
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="ml-2 text-blue-600 dark:text-blue-400 underline"
                  >
                    전체 보기
                  </button>
                </p>
              </div>
            )}
            
            {/* 일기 목록을 감싸는 스크롤 컨테이너 - 고정 높이로 변경 */}
            <div 
              className="overflow-y-auto diary-scroll-container"
              style={{ height: `${fixedDiaryHeight}px` }}
            >
              {sortedDiaries.length === 0 ? (
                <div className="text-center text-gray-500">
                  {selectedDate ? "선택한 날짜에 작성된 일기가 없습니다." : "아직 작성된 일기가 없습니다."}
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedDiaries.map((diary) => {
                    const emojiPath = getEmojiSrc(diary);
                    return (
                      <RowCard
                        key={diary.id}
                        emojiSrc={emojiPath}
                        headerText={truncateText(diary.body)}
                        bodyText={formatDate(diary.createdAt)}
                        rightIcon={
                          <button
                            className="text-2xl"
                            onClick={(e) => {
                              e.stopPropagation(); 
                              toggleLike(diary.id);
                            }}
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
                        onClick={() => navigate("/diary", { state: { diary } })}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MainPage;