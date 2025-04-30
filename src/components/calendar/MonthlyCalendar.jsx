import React, { useRef, useEffect, useState } from "react";
import Calendar from "@toast-ui/react-calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import { calendarOptions } from "./calendarOptions";

function MonthlyCalendar() {
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .toastui-calendar-daygrid-cell-date,
      .toastui-calendar-weekday-grid-date {
        text-align: center !important;
        justify-content: center !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: -4px !important;
      }

      .toastui-calendar-day-name-item {
        text-align: left !important;
        justify-content: flex-start !important;
        padding-left: 10px !important;
      }

      .toastui-calendar-day-name-item.toastui-calendar-sun,
      .toastui-calendar-daygrid-cell.toastui-calendar-sun .toastui-calendar-daygrid-cell-date {
        color: #FF0000 !important;
      }

      .toastui-calendar-daygrid-cell {
        aspect-ratio: 1 / 1 !important;
        height: auto !important;
      }

      .toastui-calendar-grid-row {
        display: grid !important;
        grid-template-columns: repeat(7, 1fr) !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  const handleClickNextButton = () => {
    const calendarInstance = calendarRef.current?.getInstance();
    if (calendarInstance) {
      calendarInstance.next();
      setCurrentDate((prev) => {
        const next = new Date(prev);
        next.setMonth(prev.getMonth() + 1);
        return next;
      });
    }
  };

  const handleClickPrevButton = () => {
    const calendarInstance = calendarRef.current?.getInstance();
    if (calendarInstance) {
      calendarInstance.prev();
      setCurrentDate((prev) => {
        const prevDate = new Date(prev);
        prevDate.setMonth(prev.getMonth() - 1);
        return prevDate;
      });
    }
  };

  return (
    <div className="w-full">
      {/* 년/월 표시 */}
      <div className="flex items-center justify-between mb-4 dark:text-darkBg">
        <h2 className="text-2xl font-bold">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
        <div className="calendar-buttons flex gap-2">
          <button
            onClick={handleClickPrevButton}
            className="calendar-nav-button"
          >
            이전 달
          </button>
          <button
            onClick={handleClickNextButton}
            className="calendar-nav-button"
          >
            다음 달
          </button>
        </div>
      </div>

      {/* 캘린더 컨테이너 */}
      <div className="aspect-[7/6] w-full">
        <Calendar
          ref={calendarRef}
          view="month"
          className="w-full h-full"
          {...calendarOptions}
        />
      </div>
    </div>
  );
}

export default MonthlyCalendar;
