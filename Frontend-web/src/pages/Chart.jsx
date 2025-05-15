import React, { useState, useEffect } from "react";
import "@toast-ui/chart/dist/toastui-chart.min.css";
import ColumnChart from "../components/charts/ColumnChart";
import NestedPieChart from "../components/charts/NestedPieChart";
import { columnData, nestedPieData } from "../components/charts/chartData";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * 차트 페이지 컴포넌트
 * 컬럼 차트와 중첩 파이 차트를 보여주는 페이지
 * @returns {JSX.Element} 차트 페이지 컴포넌트
 */
function ChartPage() {
  // 로딩 상태와 에러 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    const loadData = async () => {
      try {
        // 실제 API 호출이 있다면 여기서 처리
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen p-6 pt-[100px]">
      <div className="w-full max-w-6xl bg-yl100 dark:bg-darktext rounded-3xl shadow-lg px-6 py-10 relative font-[GangwonEduSaeeum_OTFMediumA]">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors absolute left-4 top-4 z-10"
          title="뒤로 가기"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {/* 차트 그리드 레이아웃 */}
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {/* 컬럼 차트 컨테이너 */}
          <div className="w-full md:w-[48%]">
            <ColumnChart 
              data={columnData} 
              isLoading={isLoading}
              error={error}
              title="월별 데이터 분석"
            />
          </div>
          {/* 중첩 파이 차트 컨테이너 */}
          <div className="w-full md:w-[48%]">
            <NestedPieChart 
              data={nestedPieData} 
              isLoading={isLoading}
              error={error}
              title="브라우저 사용량 분석"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default ChartPage;
