import React, { useEffect, useState } from "react";
import "@toast-ui/chart/dist/toastui-chart.min.css";
import { ColumnChart, PieChart } from "@toast-ui/react-chart";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function ChartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const diaries = location.state?.diaries || [];
  const emotionMap = location.state?.emotionMap || {};

  const [columnData, setColumnData] = useState(null);
  const [pieData, setPieData] = useState(null);

  useEffect(() => {
    if (diaries.length === 0) return;

    const monthlyMap = {};
    const emotionMapCount = {};

    diaries.forEach((diary) => {
      const date = new Date(diary.createdAt);
      const month = date.toLocaleString("default", { month: "short" });

      monthlyMap[month] = (monthlyMap[month] || 0) + 1;

      let id = typeof diary.emotionId === "object" ? diary.emotionId?.id : diary.emotionId;
      if (!id) return;
      emotionMapCount[id] = (emotionMapCount[id] || 0) + 1;
    });

    setColumnData({
      categories: Object.keys(monthlyMap),
      series: [
        {
          name: "감정 횟수",
          data: Object.values(monthlyMap),
        },
      ],
    });

    setPieData({
      series: Object.entries(emotionMapCount).map(([id, count]) => ({
        name: emotionMap[id]?.name || `감정 ${id}`,
        data: count,
      })),
    });
  }, [diaries]);

  return (
    <main className="flex items-center justify-center min-h-screen p-6 pt-[100px]">
      <div className="w-full max-w-6xl bg-yl100 dark:bg-darktext rounded-3xl shadow-lg px-6 py-10 relative font-[GangwonEduSaeeum_OTFMediumA]">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors absolute left-4 top-4 z-10"
          title="뒤로 가기"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          <div className="w-full md:w-[48%]">
            {columnData && (
              <ColumnChart
                data={columnData}
                options={{
                  chart: { title: "월별 감정 변화" },
                  yAxis: { title: "횟수" },
                  xAxis: { title: "월" },
                }}
              />
            )}
          </div>
          <div className="w-full md:w-[48%]">
            {pieData && (
              <PieChart
                data={pieData}
                options={{
                  chart: { title: "감정별 사용 비율" },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ChartPage;
