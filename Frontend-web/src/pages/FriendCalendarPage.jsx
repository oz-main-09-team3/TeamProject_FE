import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";
import RowCard from "../components/RowCard";
import { Heart } from "lucide-react";
import useFriendDiaryStore from "../store/friendDiaryStore";
import useAuthStore from "../store/authStore";
import { formatDate } from "../utils/dateUtils";

/**
 * 친구의 일기 캘린더를 보여주는 페이지 컴포넌트
 * 친구의 공개된 일기 목록을 캘린더 형태로 표시하고,
 * 일기 목록을 보여줍니다.
 */
function FriendCalendarPage() {
  const { friendId } = useParams(); // URL에서 친구 ID 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅
  const calendarContainerRef = useRef(null);
  const diaryContainerRef = useRef(null);
  
  // Zustand 스토어 사용
  const { 
    diaries, 
    filteredDiaries,
    emotions, 
    isLoading, 
    error,
    selectedDate,
    setFriendId,
    setSelectedDate,
    fetchEmotions,
    fetchFriendCalendar,
    resetData
  } = useFriendDiaryStore();
  
  const { isAuthenticated } = useAuthStore();

  // 컨테이너 높이 동기화를 위한 useEffect
  useEffect(() => {
    const syncHeight = () => {
      if (calendarContainerRef.current && diaryContainerRef.current) {
        const calendarHeight = calendarContainerRef.current.offsetHeight;
        diaryContainerRef.current.style.height = `${calendarHeight}px`;
      }
    };

    syncHeight();
    window.addEventListener('resize', syncHeight);
    return () => window.removeEventListener('resize', syncHeight);
  }, []);

  // API 응답을 MonthlyCalendar 컴포넌트에 맞게 변환하는 함수
  const transformDiariesForCalendar = (diaryList) => {
    if (!Array.isArray(diaryList)) return [];
    
    return diaryList.map(diary => ({
      id: diary.diary_id,
      emotionId: diary.emotion_id, // 캘린더 컴포넌트가 사용하는 이름으로 변환
      createdAt: new Date(diary.date).toISOString(), // MonthlyCalendar가 사용하는 createdAt 속성 추가
      // 아래는 원래 속성들 유지
      diary_id: diary.diary_id,
      emotion_id: diary.emotion_id,
      emoji: diary.emoji,
      date: diary.date,
      title: diary.title || `${diary.date}의 일기`,
    }));
  };

  // 이모지 경로 생성 함수 - RowCard에서 사용할 경로
  const getEmojiImagePath = (emojiFileName) => {
    if (!emojiFileName) return "https://dpjpkgz1vl8qy.cloudfront.net/static/emotions/default.png";
    if (emojiFileName.startsWith("http")) return emojiFileName;
    if (emojiFileName.startsWith("/")) return `https://dpjpkgz1vl8qy.cloudfront.net${emojiFileName}`;
    return `https://dpjpkgz1vl8qy.cloudfront.net/static/emotions/${emojiFileName}`;
  };

  // 일기 내용을 적절한 길이로 잘라서 반환하는 함수
  const truncateContent = (content, maxLength = 30) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // 일기를 최신순으로 정렬하는 함수
  const sortDiariesByDate = (diaries) => {
    return [...diaries].sort((a, b) => {
      const dateA = new Date(a.date || a.created_at);
      const dateB = new Date(b.date || b.created_at);
      return dateB - dateA;
    });
  };

  // 날짜 클릭 핸들러 - Zustand 스토어의 setSelectedDate 사용
  const handleDateClick = (dateKey) => {
    setSelectedDate(dateKey);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && friendId) {
        // 친구 ID 상태 먼저 설정
        setFriendId(friendId);
        
        try {
          // 이모션 데이터와 캘린더 데이터 병렬로 로드
          const calendarResponse = await fetchFriendCalendar(friendId);
          
          // API 응답만 콘솔에 출력
          console.log("fetchFriendCalendar API 응답:", calendarResponse);
          
          // 이모션 데이터 로드
          await fetchEmotions();
          
        } catch (error) {
          console.error("데이터 로딩 중 오류 발생:", error);
        }
      } else if (!isAuthenticated) {
        navigate('/login');
      }
    };
    
    loadData();
    
    // 컴포넌트 언마운트 시 데이터 리셋
    return () => resetData();
  }, [isAuthenticated, friendId, fetchEmotions, fetchFriendCalendar, setFriendId, navigate, resetData]);

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <main className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-2xl text-lighttext dark:text-darktext">일기를 불러오는 중...</div>
      </main>
    );
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return (
      <main className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </main>
    );
  }

  // 일기 데이터가 없는 경우 (API 응답이 빈 배열인 경우)
  if (diaries.length === 0) {
    return (
      <main className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-xl text-lighttext dark:text-darktext">
          아직 친구가 공유한 일기가 없습니다.
        </div>
      </main>
    );
  }

  // 캘린더 컴포넌트에 전달할 변환된 다이어리 데이터
  const transformedDiaries = transformDiariesForCalendar(diaries);
  
  // 정렬된 일기 목록
  const sortedDiaries = sortDiariesByDate(filteredDiaries);

  return (
    <main className="transition-colors duration-300">
      <section className="mx-auto max-w-5xl w-full section-container border bg-yl100/90 dark:bg-darkBg/50 border-lightGold dark:border-darkCopper rounded-xl">
        {/* 헤더 - 친구 정보 없이 페이지 제목만 표시 */}
        <div className="p-2 text-center border-b border-lightGold dark:border-darkCopper">
          <h2 className="text-xl font-semibold text-lighttext dark:text-darktext">
            친구의 일기
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-3 items-stretch justify-center pt-4">
          {/* 캘린더 섹션 - MonthlyCalendar에 변환된 데이터 전달 */}
          <div ref={calendarContainerRef} className="w-full lg:w-2/3 bg-yl100 dark:bg-darkBg rounded-lg shadow-md">
            <div className="aspect-[5/6] p-2 sm:p-1 flex items-center justify-center overflow-visible w-full h-full">
              <MonthlyCalendar 
                diaries={transformedDiaries} // 변환된 데이터 사용
                emotionMap={emotions}
                onDateClick={handleDateClick}
              />
            </div>
          </div>

          {/* 일기 목록 섹션 */}
          <div ref={diaryContainerRef} className="w-full lg:w-1/2 flex flex-col gap-2 rounded-lg h-full">
            {/* 선택된 날짜 표시 */}
            {selectedDate && (
              <div className="p-3 bg-lightBg dark:bg-darkBg rounded-lg shadow mb-2">
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
            
            {/* 일기 목록을 감싸는 스크롤 컨테이너 */}
            <div className="flex-1 overflow-y-auto diary-scroll-container">
              {filteredDiaries.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  {selectedDate ? "선택한 날짜에 작성된 일기가 없습니다." : "아직 작성된 일기가 없습니다."}
                </div>
              ) : (
                <div className="pr-2 space-y-2">
                  {sortedDiaries.map((diary) => {
                    // diary 객체가 유효한지 확인
                    if (!diary) return null;
                    
                    // API 응답에 따라 다른 속성 사용
                    const diaryId = diary.diary_id || diary.id;
                    // content가 있으면 content, 없으면 title 사용
                    const title = diary.content 
                      ? truncateContent(diary.content)
                      : (diary.title || `${formatDate(diary.date || diary.created_at)}의 일기`);
                    
                    // 날짜 정보 가져오기
                    const dateText = formatDate(diary.date || diary.created_at);
                    
                    // 이모지 경로 구성
                    // emotion 객체가 있으면 emotion.emoji 사용, 없으면 diary.emoji 사용
                    const emojiFile = diary.emotion?.emoji || diary.emoji || "default.png";
                    const emojiPath = getEmojiImagePath(emojiFile);
                    
                    return (
                      <RowCard
                        key={diaryId}
                        emojiSrc={emojiPath}
                        headerText={title}
                        bodyText={dateText}
                        rightIcon={
                          <Heart
                            className="w-6 h-6 text-lighttext dark:text-darktext"
                          />
                        }
                        onClick={() => navigate("/friend-diary", { 
                          state: { 
                            friendId: friendId,
                            diaryId: diaryId
                          } 
                        })}
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

export default FriendCalendarPage;