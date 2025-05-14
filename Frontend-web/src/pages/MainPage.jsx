import { useState, useEffect } from "react";
import RowCard from "../components/RowCard";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { fetchDiaries, fetchEmotions } from "../service/diaryApi";

function MainPage() {
  const navigate = useNavigate();
  const [diaryList, setDiaryList] = useState([]);
  const [emotionMap, setEmotionMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 감정 목록을 불러와서 매핑 테이블 생성
  const getEmotions = async () => {
    try {
      const response = await fetchEmotions();
      console.log("Emotions API response:", response); // 감정 API 응답 확인
      
      if (response && response.data) {
        const emotions = {};
        response.data.forEach(emotion => {
          console.log("Individual emotion:", emotion); // 각 감정 데이터 로그
          
          // emotion_id를 키로 사용
          emotions[emotion.emotion_id] = {
            name: emotion.emotion,
            emoji: emotion.emoji
          };
          // 한글 이름도 키로 추가
          emotions[emotion.emotion] = {
            name: emotion.emotion,
            emoji: emotion.emoji,
            id: emotion.emotion_id
          };
        });
        console.log("Final emotionMap:", emotions); // 최종 emotionMap 확인
        setEmotionMap(emotions);
      }
    } catch (err) {
      console.error('감정 목록 불러오기 실패:', err);
    }
  };

  const getDiaries = async () => {
    try {
      setIsLoading(true);
      const response = await fetchDiaries();
      
      console.log("API Full Response:", response);
      
      let diariesData = [];
      
      if (Array.isArray(response)) {
        diariesData = response;
      } 
      else if (response && Array.isArray(response.data)) {
        diariesData = response.data;
      }
      else if (response && Array.isArray(response.results)) {
        diariesData = response.results;
      }
      else if (response && response.data && Array.isArray(response.data.results)) {
        diariesData = response.data.results;
      }
      else {
        console.error("Unexpected response structure:", response);
        setError('예상치 못한 데이터 구조입니다.');
        return;
      }
      
      console.log("First diary data:", diariesData[0]); // 첫 번째 일기 데이터 확인
      
      const formattedDiaries = diariesData.map(diary => {
        console.log("Individual diary:", diary); // 각 일기 데이터 로그
        return {
          id: diary.diary_id || diary.id,
          header: diary.content ? diary.content.substring(0, 30) + "..." : "제목 없음",
          body: diary.content || "내용 없음",
          liked: false,
          emotionId: diary.emotion_id,
          emotion: diary.emotion,  // 한글 감정 텍스트
          emoji: diary.emoji,     // 이모지 이미지 경로
          createdAt: diary.created_at,
          profileUrl: diary.profile,
          user: diary.user
        };
      });
      
      console.log("Formatted diaries:", formattedDiaries); // 포맷된 일기 목록 확인
      setDiaryList(formattedDiaries);
    } catch (err) {
      console.error('일기 목록 불러오기 실패:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('일기를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 감정 목록과 일기 목록을 모두 불러오기
    Promise.all([getEmotions(), getDiaries()]);
  }, []);

  const handleLike = async (id, e) => {
    e.stopPropagation();
    
    if (loadingId !== null) return;
    
    try {
      setLoadingId(id);
      
      const currentDiary = diaryList.find(diary => diary.id === id);
      const newLikedStatus = !currentDiary.liked;
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setDiaryList(prevList => 
        prevList.map(diary => 
          diary.id === id 
            ? { ...diary, liked: newLikedStatus } 
            : diary
        )
      );
      
      console.log(`일기 ID ${id}의 좋아요 상태가 ${newLikedStatus ? '추가' : '제거'}되었습니다.`);
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setLoadingId(null);
    }
  };

  // 감정에 따라 이모지 이미지 경로 반환
  const getEmojiSrc = (diary) => {
    // diary에 직접 emoji가 있으면 사용
    if (diary.emoji) {
      return diary.emoji;
    }
    
    // emotionMap에서 찾기
    const emotionInfo = emotionMap[diary.emotion] || emotionMap[diary.emotionId];
    
    if (emotionInfo && emotionInfo.emoji) {
      return emotionInfo.emoji;
    }
    
    // 이모지가 없으면 null 반환
    return null;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-2xl text-lighttext dark:text-darktext">
          일기를 불러오는 중...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-2xl text-red-500">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
      <section className="mx-auto max-w-5xl w-full m-8 section-container border bg-yl100 dark:bg-darktext border-lightGold dark:border-darkCopper rounded-xl">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          <div className="w-full lg:w-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="aspect-[7/6]">
              <MonthlyCalendar />
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {diaryList.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                아직 작성된 일기가 없습니다.
              </div>
            ) : (
              diaryList.map((diary) => {
                const emojiPath = getEmojiSrc(diary);
                console.log('Diary emoji path:', diary.emotion, emojiPath); // 디버깅용
                
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
                      onClick={() => navigate('/diary', { state: { diary } })}
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