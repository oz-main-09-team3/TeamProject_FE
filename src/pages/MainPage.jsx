import { useState } from "react";
import RowCard from "../components/RowCard";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";

function MainPage() {
  const diaryList = [
    { id: 1, header: "아 오늘도 힘들었다.", body: "아 진짜 집 가고싶었다." },
    {
      id: 2,
      header: "코드 너무 안 돌아간다.",
      body: "나도 모르게 감자처럼 웅크렸다.",
    },
    { id: 3, header: "조금은 나아진 것 같다.", body: "어제보단 성장했어!" },
    { id: 4, header: "프론트 너무 재밌다.", body: "역시 나랑 잘 맞아!" },
    { id: 5, header: "하..버그잡기 힘들어.", body: "하지만 해냈다!" },
  ];

  return (
    <main className="min-h-screen pt-[100px] transition-colors duration-300">
      <section className="section-container border bg-yl100 dark:bg-darktext border-lightGold dark:border-darkCopper rounded-xl">
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
                  rightIcon={<span className="text-2xl">🤍</span>}
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
