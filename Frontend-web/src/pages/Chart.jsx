// src/pages/ChartPage.jsx
import React, { useEffect, useState } from "react";
import "@toast-ui/chart/dist/toastui-chart.min.css";
import ColumnChart from "../components/charts/ColumnChart";
import NestedPieChart from "../components/charts/NestedPieChart";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function ChartPage() {
  const [columnData, setColumnData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  console.log("ChartPage state:", location.state);

  useEffect(() => {
    const { diaries = [], emotionMap = {} } = location.state || {};
    if (!diaries.length) {
      setError("데이터가 없습니다. 메인 페이지에서 접근해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const monthlyMap = {};
      const emotionCountMap = {};

      diaries.forEach((diary) => {
        const date = new Date(diary.createdAt);
        const month = date.toLocaleString("default", { month: "short" });
        monthlyMap[month] = (monthlyMap[month] || 0) + 1;

        let id = typeof diary.emotionId === "object" ? diary.emotionId?.id : diary.emotionId;
        if (!id) return;
        emotionCountMap[id] = (emotionCountMap[id] || 0) + 1;
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
        series: Object.entries(emotionCountMap).map(([id, count]) => ({
          name: emotionMap[id]?.name || `감정 ${id}`,
          data: count,
        })),
      });

      setIsLoading(false);
    } catch (err) {
      setError("차트 데이터 처리 중 오류 발생");
      setIsLoading(false);
    }
  }, [location.state]);

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
            <ColumnChart 
              data={columnData} 
              isLoading={isLoading}
              error={error}
              title="월별 감정 변화"
            />
          </div>
          <div className="w-full md:w-[48%]">
            <NestedPieChart 
              data={pieData} 
              isLoading={isLoading}
              error={error}
              title="감정별 사용 비율"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default ChartPage;
