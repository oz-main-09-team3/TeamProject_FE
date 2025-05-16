import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function MonthlyCalendar({ diaries = [], emotionMap = {}, onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDiaryByDate = () => {
    const diaryMap = {};
    
    diaries.forEach(diary => {
      const date = new Date(diary.createdAt);
      const dateKey = formatDateKey(date);
      
      if (!diaryMap[dateKey] || new Date(diary.createdAt) > new Date(diaryMap[dateKey].createdAt)) {
        diaryMap[dateKey] = diary;
      }
    });
    
    return diaryMap;
  };

  const diaryMap = getDiaryByDate();

  const getEmojiSrc = (diary) => {
    let emotionId = diary.emotionId;
    if (emotionId && typeof emotionId === 'object') {
      emotionId = emotionId.id;
    }
    return `${BACKEND_URL}/static/emotions/${emotionId || 1}.png`;
  };

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    return { year, month, firstDay, lastDay, startWeek, daysInMonth };
  };

  const generateCalendarDays = () => {
    const { year, month, startWeek, daysInMonth } = getMonthData();
    const days = [];
    
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        isPrevMonth: false
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isPrevMonth: false
      });
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    const dateKey = formatDateKey(date);
    if (onDateClick) {
      onDateClick(dateKey);
    }
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const calendarDays = generateCalendarDays();
  const today = new Date();
  const todayKey = formatDateKey(today);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-xl font-bold text-lighttext dark:text-darktext">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-1.5 rounded-lg bg-lightYellow dark:bg-darkCopper hover:bg-lightGold dark:hover:bg-darkOrange transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1.5 rounded-lg bg-lightYellow dark:bg-darkCopper hover:bg-lightGold dark:hover:bg-darkOrange transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-left pl-2 font-bold text-sm py-1 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-0 flex-1 h-[calc(100%-4rem)]">
        {calendarDays.map((day, index) => {
          const dateKey = formatDateKey(day.date);
          const diary = diaryMap[dateKey];
          const isToday = dateKey === todayKey;
          const dayOfWeek = day.date.getDay();
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={`
                relative border border-lightBg dark:border-darkdark/30 cursor-pointer
                flex items-center justify-center aspect-square
                transition-colors duration-200
                ${day.isCurrentMonth ? 'bg-lightBg dark:bg-darkBg' : 'bg-yl100 dark:bg-brown900'}
                ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                hover:bg-lightYellow/50 dark:hover:bg-darkCopper/50
              `}
            >
              {/* 날짜 번호 - 좌측 상단 */}
              <span
                className={`
                  absolute top-1 left-2 z-10 text-xs font-medium
                  ${!day.isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''}
                  ${dayOfWeek === 0 ? 'text-red-500' : ''}
                  ${isToday ? 'font-bold' : ''}
                `}
              >
                {day.date.getDate()}
              </span>
              
              {/* 이모지 - 날짜 아래부터 하단까지 가득 */}
              {diary && (
                <img
                  src={getEmojiSrc(diary)}
                  alt="emotion"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '1rem', // 날짜 숫자 영역만큼 내림 (조금 더 위로)
                    transform: 'translateX(-50%)',
                    width: '90%',
                    height: '80%', // 하단에서 조금 더 올라오게
                    objectFit: 'contain',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthlyCalendar;