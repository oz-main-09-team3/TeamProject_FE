import React, { useState, useEffect } from "react";
import RechartsBarChart from "../components/charts/RechartsBarChart";
import RechartsPieChart from "../components/charts/RechartsPieChart";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchDiaries, fetchEmotions } from "../service/diaryApi";
import { getEmojiText } from "../constants/Emoji"; // Emoji 상수 가져오기

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * 차트 페이지 컴포넌트
 * 월별 일기 작성 횟수와 이번 달 사용한 이모지 갯수를 보여주는 페이지
 * @returns {JSX.Element} 차트 페이지 컴포넌트
 */
function ChartPage() {
  // 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diaryList, setDiaryList] = useState([]);
  const [emotionMap, setEmotionMap] = useState({});
  const [chartData, setChartData] = useState({
    monthlyCount: null, // 월별 일기 작성 횟수 데이터
    emotionDistribution: null // 이번 달 사용한 이모지 갯수 데이터
  });
  
  const navigate = useNavigate();

  // 감정 데이터 가져오기
  const getEmotions = async () => {
    try {
      const response = await fetchEmotions();
      if (response?.data) {
        const emotions = {};
        response.data.forEach((emotion) => {
          emotions[emotion.id] = {
            name: emotion.emotion,
            image_url: emotion.image_url,
          };
          emotions[emotion.emotion] = {
            name: emotion.emotion,
            image_url: emotion.image_url,
            id: emotion.id,
          };
        });
        setEmotionMap(emotions);
        return emotions;
      }
      return {};
    } catch (err) {
      console.error("감정 목록 불러오기 실패:", err);
      setError("감정 목록을 불러오는데 실패했습니다.");
      return {};
    }
  };

  // 일기 데이터 가져오기
  const getDiaries = async () => {
    try {
      const response = await fetchDiaries();
      let diariesData = [];

      if (Array.isArray(response)) {
        diariesData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        diariesData = response.data;
      } else if (response?.data?.results && Array.isArray(response.data.results)) {
        diariesData = response.data.results;
      } else {
        console.error("Unexpected response structure:", response);
        setError("예상치 못한 데이터 구조입니다.");
        return [];
      }

      const formattedDiaries = diariesData.map((diary) => {
        let emotionValue;
        if (diary.emotion && typeof diary.emotion === "object") {
          emotionValue = diary.emotion;
        } else if (diary.emotion) {
          emotionValue = diary.emotion;
        } else if (diary.emotion_id) {
          emotionValue = diary.emotion_id;
        } else {
          emotionValue = diary.id;
        }

        return {
          id: diary.diary_id || diary.id,
          content: diary.content || "내용 없음",
          emotionId: emotionValue,
          emotion: diary.emotion,
          createdAt: diary.created_at,
        };
      });

      setDiaryList(formattedDiaries);
      return formattedDiaries;
    } catch (err) {
      console.error("일기 목록 불러오기 실패:", err);
      setError("일기를 불러오는데 실패했습니다.");
      return [];
    }
  };

  // 차트 데이터 준비
  const prepareChartData = (diaries, emotions) => {
    // 월별 일기 작성 횟수 데이터 생성
    const monthlyCountMap = {};
    const currentYear = new Date().getFullYear();
    const months = [
      "1월", "2월", "3월", "4월", "5월", "6월", 
      "7월", "8월", "9월", "10월", "11월", "12월"
    ];
    
    // 월별 객체 초기화 (1월~12월)
    for (let i = 0; i < 12; i++) {
      monthlyCountMap[i+1] = { month: months[i], count: 0 };
    }
    
    // 일기 데이터를 기반으로 월별 작성 횟수 계산
    diaries.forEach(diary => {
      if (diary.createdAt) {
        const diaryDate = new Date(diary.createdAt);
        const diaryMonth = diaryDate.getMonth() + 1; // JavaScript의 월은 0부터 시작
        const diaryYear = diaryDate.getFullYear();
        
        // 현재 년도의 데이터만 집계
        if (diaryYear === currentYear && monthlyCountMap[diaryMonth]) {
          monthlyCountMap[diaryMonth].count += 1;
        }
      }
    });
    
    // 차트용 데이터 형식으로 변환
    const monthlyCountData = {
      categories: Object.values(monthlyCountMap).map(item => item.month),
      series: [
        {
          name: '일기 작성 횟수',
          data: Object.values(monthlyCountMap).map(item => item.count)
        }
      ]
    };
    
    // 이번 달 사용한 이모지 갯수 데이터 생성
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthDiaries = diaries.filter(diary => {
      if (!diary.createdAt) return false;
      const diaryDate = new Date(diary.createdAt);
      return diaryDate.getMonth() + 1 === currentMonth && 
             diaryDate.getFullYear() === currentYear;
    });
    
    const emotionCounts = {};
    
    // 이번 달 일기에서 사용된 이모지 집계
    currentMonthDiaries.forEach(diary => {
      let emotionId;
      let emotionName;
      
      if (diary.emotionId && typeof diary.emotionId === 'object') {
        emotionId = diary.emotionId.id;
        // getEmojiText 함수 사용하여 ID를 텍스트로 변환
        emotionName = emotions[emotionId]?.name || getEmojiText(emotionId);
      } else if (typeof diary.emotionId === 'number') {
        emotionId = diary.emotionId;
        // getEmojiText 함수 사용하여 ID를 텍스트로 변환
        emotionName = emotions[emotionId]?.name || getEmojiText(emotionId);
      } else {
        emotionId = 1; // 기본값
        emotionName = getEmojiText(1);
      }
      
      if (!emotionCounts[emotionName]) {
        emotionCounts[emotionName] = 0;
      }
      emotionCounts[emotionName] += 1;
    });
    
    // 중첩 파이 차트용 데이터 형식으로 변환
    const emotionSeries = Object.entries(emotionCounts).map(([name, count]) => ({
      name,
      data: count
    }));
    
    // Recharts에 맞는 데이터 형식으로 변환
    const emotionDistributionData = {
      series: emotionSeries.length > 0 ? emotionSeries : [{ name: '데이터 없음', data: 1 }]
    };
    
    setChartData({
      monthlyCount: monthlyCountData,
      emotionDistribution: emotionDistributionData
    });
  };

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const emotions = await getEmotions();
        const diaries = await getDiaries();
        prepareChartData(diaries, emotions);
        setIsLoading(false);
      } catch (err) {
        console.error("데이터 로딩 중 오류:", err);
        setError("데이터를 불러오는데 실패했습니다.");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 현재 월 이름 가져오기
  const getCurrentMonthName = () => {
    const months = [
      "1월", "2월", "3월", "4월", "5월", "6월", 
      "7월", "8월", "9월", "10월", "11월", "12월"
    ];
    const currentMonth = new Date().getMonth();
    return months[currentMonth];
  };

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

        {/* 페이지 제목 */}
        <h1 className="text-3xl font-bold text-center mb-8 text-lighttext dark:text-white">
          감정 일기 통계
        </h1>

        {/* 차트 그리드 레이아웃 */}
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {/* 컬럼 차트 컨테이너 - RechartsBarChart 사용 */}
          <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4 text-lighttext dark:text-white">
              월별 일기 작성 횟수
            </h2>
            <RechartsBarChart 
              data={chartData.monthlyCount} 
              isLoading={isLoading}
              error={error}
              title="월별 일기 작성 횟수"
              height={350}
            />
          </div>

          {/* 파이 차트 컨테이너 - RechartsPieChart 사용 */}
          <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4 text-lighttext dark:text-white">
              {getCurrentMonthName()} 감정 분포
            </h2>
            <RechartsPieChart 
              data={chartData.emotionDistribution} 
              isLoading={isLoading}
              error={error}
              title={`${getCurrentMonthName()} 감정 분포`}
              height={350}
            />
          </div>
        </div>

        {/* 데이터 요약 정보 */}
        {!isLoading && !error && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-lighttext dark:text-white">
              통계 요약
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-lighttext dark:text-white">
                  연간 통계
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  올해 총 일기 작성 수: {chartData.monthlyCount?.series[0].data.reduce((acc, curr) => acc + curr, 0) || 0}개
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  가장 많이 작성한 달: {
                    chartData.monthlyCount 
                    ? chartData.monthlyCount.categories[
                        chartData.monthlyCount.series[0].data.indexOf(
                          Math.max(...chartData.monthlyCount.series[0].data)
                        )
                      ]
                    : '없음'
                  }
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-lighttext dark:text-white">
                  이번 달 통계
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  이번 달 일기 작성 수: {
                    chartData.monthlyCount
                    ? chartData.monthlyCount.series[0].data[new Date().getMonth()]
                    : 0
                  }개
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  가장 많이 사용한 감정: {
                    chartData.emotionDistribution?.series[0]?.name === '데이터 없음'
                    ? '없음'
                    : chartData.emotionDistribution?.series.sort((a, b) => b.data - a.data)[0]?.name || '없음'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ChartPage;