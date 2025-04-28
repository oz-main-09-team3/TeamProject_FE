import React, { useRef, useEffect, useState } from "react";
import Calendar from "@toast-ui/react-calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

function MonthlyCalendar() {
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date()); // ✅ 현재 날짜 상태

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .toastui-calendar-daygrid-cell-date,
      .toastui-calendar-weekday-grid-date,
      .tui-full-calendar-weekday-grid-date,
      .tui-calendar-weekday-grid-date {
        text-align: center !important;
        justify-content: center !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: -4px !important;
      }
      
      .toastui-calendar-day-name-item,
      .tui-full-calendar-day-name-item,
      .tui-calendar-day-name-item {
        text-align: left !important;
        justify-content: flex-start !important;
        padding-left: 10px !important;
      }
      
      .toastui-calendar-day-name-item.toastui-calendar-sun,
      .toastui-calendar-daygrid-cell.toastui-calendar-sun .toastui-calendar-daygrid-cell-date,
      .tui-full-calendar-day-name-item.tui-full-calendar-sun,
      .tui-full-calendar-daygrid-cell.tui-full-calendar-sun .tui-full-calendar-daygrid-cell-date,
      .tui-calendar-day-name-item.tui-calendar-sun,
      .tui-calendar-daygrid-cell.tui-calendar-sun .tui-calendar-daygrid-cell-date {
        color: #FF0000 !important;
      }
      
      .toastui-calendar-daygrid-cell,
      .tui-full-calendar-daygrid-cell,
      .tui-calendar-daygrid-cell {
        text-align: left !important;
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
    if (calendarRef.current) {
      const calendarInstance = calendarRef.current.getInstance();
      calendarInstance.next();

      setCurrentDate((prev) => {
        const next = new Date(prev);
        next.setMonth(next.getMonth() + 1);
        return next;
      });
    }
  };

  const handleClickPrevButton = () => {
    if (calendarRef.current) {
      const calendarInstance = calendarRef.current.getInstance();
      calendarInstance.prev();

      setCurrentDate((prev) => {
        const prevDate = new Date(prev);
        prevDate.setMonth(prevDate.getMonth() - 1);
        return prevDate;
      });
    }
  };

  const calendarOptions = {
    view: "month",
    defaultView: "month",
    isReadOnly: false,
    usageStatistics: false,
    theme: {
      "common.saturday.color": "#888888",
      "common.sunday.color": "#FF0000",
      "common.dayName.saturday.color": "#888888",
      "common.dayName.sunday.color": "#FF0000",
      "month.dayname.height": "31px",
      "month.dayname.borderLeft": "1px solid #e5e5e5",
      "month.dayname.textAlign": "left",
      "month.dayname.paddingLeft": "10px",
      "month.day.fontSize": "16px",
      "month.day.fontWeight": "400",
      "month.day.height": "42px",
      "month.day.textAlign": "center",
      "month.sunday.color": "#FF0000",
      "month.dayname.sunday.color": "#FF0000",
      "month.holidayExceptThisMonth.color": "#f3acac",
      "month.dayExceptThisMonth.color": "#bbb",
      "month.weekend.backgroundColor": "#fafafa",
      "month.schedule.borderRadius": "2px",
      "month.schedule.height": "24px",
      "month.schedule.marginTop": "2px",
      "month.schedule.marginLeft": "10px",
      "month.schedule.marginRight": "10px",
    },
    month: {
      daynames: ["일", "월", "화", "수", "목", "금", "토"],
      startDayOfWeek: 0,
      narrowWeekend: false,
    },
    calendars: [
      {
        id: "cal1",
        name: "기본 캘린더",
        color: "#ffffff",
        backgroundColor: "#34c38f",
        borderColor: "#34c38f",
      },
    ],
  };

  return (
    <div style={{ width: "800px" }}>
      {/* ✅ 년/월 표시 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
        <div className="calendar-buttons">
          <button onClick={handleClickPrevButton}>이전 달</button>
          <button
            onClick={handleClickNextButton}
            style={{ marginLeft: "10px" }}
          >
            다음 달
          </button>
        </div>
      </div>

      <Calendar
        ref={calendarRef}
        view="month"
        className="w-full"
        {...calendarOptions}
      />
    </div>
  );
}

export default MonthlyCalendar;
