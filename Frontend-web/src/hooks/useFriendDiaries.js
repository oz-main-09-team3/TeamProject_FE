import { useState, useEffect } from "react";
import { fetchDiaries, fetchEmotions } from "../service/diaryApi";
import { addLike, removeLike } from "../service/likeApi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * 친구의 일기 목록과 관련된 상태 및 로직을 관리하는 커스텀 훅
 * @param {string} friendId - 친구의 ID
 * @returns {Object} 일기 목록 관련 상태와 핸들러 함수들
 */
export const useFriendDiaries = (friendId) => {
  // 상태 관리
  const [diaryList, setDiaryList] = useState([]); // 전체 일기 목록
  const [filteredDiaryList, setFilteredDiaryList] = useState([]); // 필터링된 일기 목록
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const [emotionMap, setEmotionMap] = useState({}); // 감정 정보 매핑
  const [loadingId, setLoadingId] = useState(null); // 좋아요 처리 중인 일기 ID
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  /**
   * 감정 목록을 가져와서 매핑하는 함수
   */
  const getEmotions = async () => {
    try {
      const response = await fetchEmotions();
      if (response?.data) {
        const emotions = {};
        response.data.forEach((emotion) => {
          // ID로 감정 정보 매핑
          emotions[emotion.id] = {
            name: emotion.emotion,
            image_url: emotion.image_url,
          };
          // 감정 이름으로도 매핑 (이중 매핑)
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

  /**
   * 친구의 일기 목록을 가져오는 함수
   */
  const getFriendDiaries = async () => {
    try {
      setIsLoading(true);
      const response = await fetchDiaries(friendId);
      let diariesData = [];

      // API 응답 구조에 따른 데이터 추출
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

      // 공개된 일기만 필터링
      const publicDiaries = diariesData.filter(diary => diary.visibility === true);

      // 일기 데이터 포맷팅
      const formattedDiaries = publicDiaries.map((diary) => {
        // 감정 정보 추출
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

        const isLiked = diary.is_liked || false;

        return {
          id: diary.diary_id || diary.id,
          header: diary.content ? diary.content.substring(0, 30) + "..." : "제목 없음",
          body: diary.content || "내용 없음",
          liked: isLiked,
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
      console.error("친구 일기 목록 불러오기 실패:", err);
      setError("친구의 일기를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 날짜 클릭 시 해당 날짜의 일기만 필터링하는 함수
   * @param {string} dateKey - 선택된 날짜 (YYYY-MM-DD 형식)
   */
  const handleDateClick = (dateKey) => {
    if (selectedDate === dateKey) {
      // 같은 날짜 재클릭 시 필터 해제
      setSelectedDate(null);
      setFilteredDiaryList(diaryList);
    } else {
      setSelectedDate(dateKey);
      // 선택된 날짜의 일기만 필터링
      const filtered = diaryList.filter(diary => {
        const diaryDate = new Date(diary.createdAt);
        const diaryDateKey = `${diaryDate.getFullYear()}-${(diaryDate.getMonth() + 1).toString().padStart(2, '0')}-${diaryDate.getDate().toString().padStart(2, '0')}`;
        return diaryDateKey === dateKey;
      });
      setFilteredDiaryList(filtered);
    }
  };

  /**
   * 일기 좋아요 처리 함수
   * @param {number} id - 일기 ID
   * @param {Event} e - 이벤트 객체
   */
  const handleLike = async (id, e) => {
    e.stopPropagation();
    if (loadingId !== null) return;

    try {
      setLoadingId(id);
      const currentDiary = diaryList.find((diary) => diary.id === id);
      const newLikedStatus = !currentDiary.liked;

      // 좋아요 상태에 따른 API 호출
      if (newLikedStatus) {
        await addLike(id);
      } else {
        await removeLike(id);
      }

      // 일기 목록 상태 업데이트
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

  /**
   * 일기의 감정 이모지 이미지 URL을 반환하는 함수
   * @param {Object} diary - 일기 객체
   * @returns {string} 이모지 이미지 URL
   */
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

  // 컴포넌트 마운트 시 감정 목록과 일기 목록 가져오기
  useEffect(() => {
    Promise.all([
      getEmotions(),
      getFriendDiaries(),
    ]);
  }, [friendId]);

  return {
    diaryList,
    filteredDiaryList,
    selectedDate,
    emotionMap,
    loadingId,
    isLoading,
    error,
    handleDateClick,
    handleLike,
    getEmojiSrc,
  };
}; 