import { useState } from "react";
import RowCard from "../components/RowCard";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";

function MainPage() {
  const [diaryList, setDiaryList] = useState([
    { id: 1, header: "아 오늘도 힘들었다.", body: "아 진짜 집 가고싶었다.", liked: false },
    {
      id: 2,
      header: "코드 너무 안 돌아간다.",
      body: "나도 모르게 감자처럼 웅크렸다.",
      liked: false
    },
    { id: 3, header: "조금은 나아진 것 같다.", body: "어제보단 성장했어!", liked: false },
    { id: 4, header: "프론트 너무 재밌다.", body: "역시 나랑 잘 맞아!", liked: false },
    { id: 5, header: "하..버그잡기 힘들어.", body: "하지만 해냈다!", liked: false },
  ]);

  const [loadingId, setLoadingId] = useState(null);

  const handleLike = async (id, e) => {
    e.stopPropagation();
    
    if (loadingId !== null) return;
    
    try {
      setLoadingId(id);
      
      const currentDiary = diaryList.find(diary => diary.id === id);
      const newLikedStatus = !currentDiary.liked;
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setDiaryList(prevList => 
        prevList.map(diary => 
          diary.id === id 
            ? { ...diary, liked: newLikedStatus } 
            : diary
        )
      );
      
      console.log(`일기 ID ${id}의 좋아요 상태가 ${newLikedStatus ? '추가' : '제거'}되었습니다.`);
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen transition-colors duration-300">
      <section className="m-8 section-container border bg-yl100 dark:bg-darktext border-lightGold dark:border-darkCopper rounded-xl">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* 캘린더 영역 */}
          <div className="w-full lg:w-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="aspect-[7/6]">
              <MonthlyCalendar />
            </div>
          </div>

          {/* 일기 리스트 영역 */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {diaryList.map((diary) => (
              <div key={diary.id}>
                <RowCard
                  emojiSrc="/profile.png"
                  headerText={diary.header}
                  bodyText={diary.body}
                  rightIcon={
                    <button 
                      className="text-2xl"
                      onClick={(e) => handleLike(diary.id, e)}
                      disabled={loadingId === diary.id}
                      style={{ opacity: loadingId === diary.id ? 0.5 : 1 }}
                    >
                      {diary.liked ? '❤️' : '🤍'}
                    </button>
                  }
                  onClick={() => alert(`${diary.header} 클릭!`)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default MainPage;