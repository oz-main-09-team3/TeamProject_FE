import React, { useEffect } from "react";
import RechartsBarChart from "../components/charts/RechartsBarChart";
import RechartsPieChart from "../components/charts/RechartsPieChart";
import BackButton from "../components/BackButton";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";

const useChartStore = create((set) => ({
  monthlyCount: null,
  emotionDistribution: null,
  isLoading: false,
  error: null,
  
  // 차트 데이터 로딩 시작
  setLoading: () => set({ isLoading: true, error: null }),
  
  // 차트 데이터 설정
  setChartData: (monthlyCount, emotionDistribution) => 
    set({ 
      monthlyCount, 
      emotionDistribution, 
      isLoading: false, 
      error: null 
    }),
  
  // 에러 설정
  setError: (error) => set({ error, isLoading: false })
}));

/**
 * 차트 페이지 컴포넌트
 * 월별 일기 작성 횟수와 이번 달 사용한 이모지 갯수를 보여주는 페이지
 */
function ChartPage() {
  const navigate = useNavigate();
  
  // Auth 스토어 사용
  const { isAuthenticated } = useAuthStore();
  
  // Chart 스토어 사용
  const { 
    monthlyCount, 
    emotionDistribution, 
    isLoading, 
    error, 
    setLoading, 
    setChartData, 
    setError 
  } = useChartStore();
  
  // Diary 스토어에서 일기 데이터와 감정 데이터 가져오기
  const { diaries, emotions, fetchDiaries, fetchEmotions } = useDiaryStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        setLoading();
        try {
          await Promise.all([fetchEmotions(), fetchDiaries()]);
          prepareChartData(diaries, emotions);
        } catch (err) {
          console.error("데이터 로딩 중 오류:", err);
          setError("데이터를 불러오는데 실패했습니다.");
        }
      } else {
        navigate('/login');
      }
    };
    
    loadData();
  }, [isAuthenticated, fetchEmotions, fetchDiaries, diaries, emotions, setLoading, setError, navigate]);

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
        emotionName = emotions[emotionId]?.name || `감정${emotionId}`;
      } else if (typeof diary.emotionId === 'number') {
        emotionId = diary.emotionId;
        emotionName = emotions[emotionId]?.name || `감정${emotionId}`;
      } else {
        emotionId = 1; // 기본값
        emotionName = `감정${emotionId}`;
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
    
    // 차트 데이터 설정
    setChartData(monthlyCountData, emotionDistributionData);
  };

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
        <BackButton to={-1} />

        {/* 페이지 제목 */}
        <h1 className="text-3xl font-bold text-center mb-8 text-lighttext dark:text-darkBg">
          감정 일기 통계
        </h1>

        {/* 차트 그리드 레이아웃 */}
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {/* 컬럼 차트 컨테이너 - RechartsBarChart 사용 */}
          <div className="w-full md:w-[48%] bg-yl100 dark:bg-darkBg p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4 text-lighttext dark:text-darktext">
              월별 일기 작성 횟수
            </h2>
            <RechartsBarChart 
              data={monthlyCount} 
              isLoading={isLoading}
              error={error}
              title="월별 일기 작성 횟수"
              height={350}
            />
          </div>

          {/* 파이 차트 컨테이너 - RechartsPieChart 사용 */}
          <div className="w-full md:w-[48%] bg-yl100 dark:bg-darkBg p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4 text-lighttext dark:text-darktext">
              {getCurrentMonthName()} 감정 분포
            </h2>
            <RechartsPieChart 
              data={emotionDistribution} 
              isLoading={isLoading}
              error={error}
              title={`${getCurrentMonthName()} 감정 분포`}
              height={350}
            />
          </div>
        </div>

        {/* 데이터 요약 정보 */}
        {!isLoading && !error && (
          <div className="mt-8 bg-yl100 dark:bg-darkBg p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-lighttext dark:text-darktext">
              통계 요약
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-lightYellow dark:bg-darkBrown rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-lighttext dark:text-darktext">
                  연간 통계
                </h3>
                <p className="text-lighttext dark:text-darktext">
                  올해 총 일기 작성 수: {monthlyCount?.series[0].data.reduce((acc, curr) => acc + curr, 0) || 0}개
                </p>
                <p className="text-lighttext dark:text-darktext mt-2">
                  가장 많이 작성한 달: {
                    monthlyCount 
                    ? monthlyCount.categories[
                        monthlyCount.series[0].data.indexOf(
                          Math.max(...monthlyCount.series[0].data)
                        )
                      ]
                    : '없음'
                  }
                </p>
              </div>
              <div className="p-4 bg-lightYellow dark:bg-darkBrown rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-lighttext dark:text-darktext">
                  이번 달 통계
                </h3>
                <p className="text-lighttext dark:text-darktext">
                  이번 달 일기 작성 수: {
                    monthlyCount
                    ? monthlyCount.series[0].data[new Date().getMonth()]
                    : 0
                  }개
                </p>
                <p className="text-lighttext dark:text-darktext mt-2">
                  가장 많이 사용한 감정: {
                    emotionDistribution?.series[0]?.name === '데이터 없음'
                    ? '없음'
                    : emotionDistribution?.series.sort((a, b) => b.data - a.data)[0]?.name || '없음'
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