import { useState, useEffect } from "react";
import RowCard from "../components/RowCard";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { fetchDiaries, fetchEmotions } from "../service/diaryApi";
import { fetchEmotionTrend, fetchEmotionCount } from "../service/emotionApi";
import { Chart } from "@toast-ui/react-chart";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [diaryList, setDiaryList] = useState([]);
  const [filteredDiaryList, setFilteredDiaryList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [emotionMap, setEmotionMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [countData, setCountData] = useState(null);

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
      }
    } catch (err) {
      console.error("감정 목록 불러오기 실패:", err);
    }
  };

  const getDiaries = async () => {
    try {
      setIsLoading(true);
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
        return;
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
          header: diary.content ? diary.content.substring(0, 30) + "..." : "제목 없음",
          body: diary.content || "내용 없음",
          liked: false,
          emotionId: emotionValue,
          emotion: diary.emotion,
          createdAt: diary.created_at,
          profileUrl: diary.profile,
          user: diary.user,
        };
      });

      setDiaryList(formattedDiaries);
      setFilteredDiaryList(formattedDiaries);
    } catch (err) {
      console.error("일기 목록 불러오기 실패:", err);
      setError("일기를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmotionTrend = async () => {
    try {
      const today = new Date();
      const to = today.toISOString().slice(0, 10);
      const fromDate = new Date(today);
      fromDate.setMonth(fromDate.getMonth() - 1);
      const from = fromDate.toISOString().slice(0, 10);

      const trendRes = await fetchEmotionTrend({ from, to });
      console.log("Emotion Trend 응답:", trendRes);
      const data = trendRes?.data;

      if (data?.emotion && Array.isArray(data.labels) && Array.isArray(data.values)) {
        const trendFormatted = {
          categories: data.labels,
          series: [
            {
              name: data.emotion.emotion,
              data: data.values,
            },
          ],
        };
        setTrendData(trendFormatted);
      }
    } catch (err) {
      console.error("감정 통계 API 호출 실패:", err);
    }
  };

  const loadEmotionCount = async () => {
    try {
      const today = new Date();
      const to = today.toISOString().slice(0, 10);
      const fromDate = new Date(today);
      fromDate.setMonth(fromDate.getMonth() - 1);
      const from = fromDate.toISOString().slice(0, 10);

      const res = await fetchEmotionCount({ from, to });
      console.log("Emotion Count 응답:", res);

      if (Array.isArray(res?.data) && res.data.length > 0) {
        const pieFormatted = {
          series: res.data.map((item) => ({
            name: item?.emotion?.emotion ?? "Unknown",
            data: item?.count ?? 0,
          })),
        };
        setCountData(pieFormatted);
      }
    } catch (err) {
      console.error("감정 비율 API 호출 실패:", err);
    }
  };

  useEffect(() => {
    Promise.all([
      getEmotions(),
      getDiaries(),
      loadEmotionTrend(),
      loadEmotionCount(),
    ]);
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      getDiaries();
    }
  }, [location.state]);

  const handleDateClick = (dateKey) => {
    if (selectedDate === dateKey) {
      setSelectedDate(null);
      setFilteredDiaryList(diaryList);
    } else {
      setSelectedDate(dateKey);
      const filtered = diaryList.filter(diary => {
        const diaryDate = new Date(diary.createdAt);
        const diaryDateKey = `${diaryDate.getFullYear()}-${(diaryDate.getMonth() + 1).toString().padStart(2, '0')}-${diaryDate.getDate().toString().padStart(2, '0')}`;
        return diaryDateKey === dateKey;
      });
      setFilteredDiaryList(filtered);
    }
  };

  const handleLike = async (id, e) => {
    e.stopPropagation();
    if (loadingId !== null) return;

    try {
      setLoadingId(id);
      const currentDiary = diaryList.find((diary) => diary.id === id);
      const newLikedStatus = !currentDiary.liked;

      await new Promise((resolve) => setTimeout(resolve, 300));

      setDiaryList((prevList) =>
        prevList.map((diary) =>
          diary.id === id ? { ...diary, liked: newLikedStatus } : diary
        )
      );
      
      setFilteredDiaryList((prevList) =>
        prevList.map((diary) =>
          diary.id === id ? { ...diary, liked: newLikedStatus } : diary
        )
      );
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  const getEmojiSrc = (diary) => {
    let emotionId = diary.emotionId;
    if (emotionId && typeof emotionId === "object") {
      emotionId = emotionId.id;
    }
    if (emotionId && !isNaN(emotionId)) {
      return `${BACKEND_URL}/static/emotions/${emotionId}.png`;
    }
    return `${BACKEND_URL}/static/emotions/1.png`;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-2xl text-lighttext dark:text-darktext">일기를 불러오는 중...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
      <section className="mx-auto max-w-5xl w-full m-8 section-container border bg-yl100 dark:bg-darktext border-lightGold dark:border-darkCopper rounded-xl">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="aspect-[7/6]">
              <MonthlyCalendar 
                diaries={diaryList}
                emotionMap={emotionMap}
                onDateClick={handleDateClick}
              />
            </div>

            {trendData?.series?.length > 0 && (
              <div className="mt-6">
                <Chart
                  data={trendData}
                  options={{
                    chart: { width: 460, height: 300, title: "월별 감정 변화" },
                    yAxis: { title: "횟수" },
                    xAxis: { title: "날짜" },
                  }}
                  type="bar"
                />
              </div>
            )}

            {countData?.series?.length > 0 && (
              <div className="mt-6">
                <Chart
                  data={countData}
                  options={{
                    chart: { width: 400, height: 300, title: "감정 이모지 사용 비율" },
                  }}
                  type="pie"
                />
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {selectedDate && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedDate}의 일기를 보고 있습니다.
                  <button 
                    onClick={() => handleDateClick(selectedDate)}
                    className="ml-2 text-blue-600 dark:text-blue-400 underline"
                  >
                    전체 보기
                  </button>
                </p>
              </div>
            )}
            
            {filteredDiaryList.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {selectedDate ? "선택한 날짜에 작성된 일기가 없습니다." : "아직 작성된 일기가 없습니다."}
              </div>
            ) : (
              filteredDiaryList.map((diary) => {
                const emojiPath = getEmojiSrc(diary);
                return (
                  <div key={diary.id}>
                    <RowCard
                      emojiSrc={emojiPath}
                      headerText={diary.header}
                      bodyText={diary.body}
                      rightIcon={
                        <button
                          className="text-2xl"
                          onClick={(e) => handleLike(diary.id, e)}
                          disabled={loadingId === diary.id}
                          style={{ opacity: loadingId === diary.id ? 0.5 : 1 }}
                        >
                          <Heart
                            className={`w-6 h-6 ${
                              diary.liked
                                ? "fill-red-500 text-red-500"
                                : "text-lighttext dark:text-darktext"
                            }`}
                          />
                        </button>
                      }
                      onClick={() => navigate("/diary", { state: { diary } })}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default MainPage;