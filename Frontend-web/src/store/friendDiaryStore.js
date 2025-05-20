import { create } from 'zustand';
import { fetchFriendDiaryCalendar } from '../service/friendDiaryApi';
import { fetchEmotions } from '../service/diaryApi';

/**
 * 친구 일기 관련 상태 관리를 위한 Zustand 스토어
 * 친구의 일기 캘린더, 특정 날짜의 일기 목록, 이모션 데이터 등을 관리
 */
const useFriendDiaryStore = create((set, get) => ({
  // 상태
  friendId: null,          // 현재 조회 중인 친구 ID
  diaries: [],             // 전체 일기 목록 (캘린더용)
  filteredDiaries: [],     // 필터링된 일기 목록 (날짜 필터링 후)
  emotions: {},            // 이모션 데이터 맵
  selectedDate: null,      // 선택된 날짜
  isLoading: false,        // 로딩 상태
  error: null,             // 에러 메시지

  // 액션
  
  // 친구 ID 설정
  setFriendId: (friendId) => set({ friendId }),
  
  // 선택된 날짜 설정 및 해당 날짜의 일기 필터링
  setSelectedDate: (date) => {
    const { diaries } = get(); // 현재 스토어에서 모든 일기 가져오기
    
    set({ selectedDate: date });
    
    if (date) {
      // 날짜가 선택되면 해당 날짜의 일기만 필터링
      const filtered = diaries.filter(diary => {
        const diaryDate = new Date(diary.date || diary.created_at);
        const diaryDateStr = diaryDate.toISOString().split('T')[0];
        return diaryDateStr === date;
      });
      
      console.log(`${date}에 해당하는 일기로 필터링:`, filtered);
      set({ filteredDiaries: filtered });
    } else {
      // 날짜 선택이 해제되면 전체 일기 목록으로 복원
      set({ filteredDiaries: diaries });
    }
  },
  
  // 이모션 데이터 가져오기
  fetchEmotions: async () => {
    try {
      console.log('이모션 데이터 요청 중...');
      
      // fetchEmotions 함수 사용
      const response = await fetchEmotions();
      
      console.log('이모션 API 응답:', response);
      
      // 이모션 데이터를 맵 형태로 변환하여 저장 (emotion_id를 키로 사용)
      const emotionMap = {};
      
      response.data.forEach(emotion => {
        emotionMap[emotion.emotion_id] = emotion;
      });
      
      console.log('이모션 맵 생성 완료:', emotionMap);
      
      set({ emotions: emotionMap });
      return emotionMap;
    } catch (error) {
      console.error("이모션 데이터 로딩 실패:", error);
      // 에러가 발생해도 앱 실행에 치명적이지 않으므로 빈 객체 반환
      return {};
    }
  },
  
  // 친구 다이어리 캘린더 데이터 가져오기
  fetchFriendCalendar: async (friendId) => {
    set({ isLoading: true, error: null, friendId });
    
    try {
      console.log(`친구 ID ${friendId}의 다이어리 캘린더 데이터 요청 중...`);
      
      // 달력 데이터를 가져오는 API 호출 (이모지 표시용)
      const response = await fetchFriendDiaryCalendar(friendId);
      console.log('친구 다이어리 캘린더 API 응답:', response);
      const calendarData = response.data;
      
      // 데이터 구조 분석
      console.log('캘린더 데이터 구조 분석:', {
        데이터타입: typeof calendarData,
        배열여부: Array.isArray(calendarData),
        항목수: Array.isArray(calendarData) ? calendarData.length : '배열 아님',
        샘플데이터: Array.isArray(calendarData) && calendarData.length > 0 
          ? JSON.stringify(calendarData[0], null, 2) 
          : '데이터 없음'
      });
      
      // 달력 데이터를 상태에 저장
      set({ 
        diaries: calendarData,
        filteredDiaries: calendarData, // 초기에는 전체 일기 표시
        isLoading: false 
      });
      
      return calendarData;
    } catch (error) {
      console.error("친구 다이어리 캘린더 로딩 중 오류 발생:", error);
      console.error("에러 상세 정보:", {
        메시지: error.message,
        응답상태: error.response?.status,
        응답데이터: error.response?.data
      });
      
      set({ 
        error: "친구의 캘린더를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.",
        isLoading: false 
      });
      return [];
    }
  },
  
  // 상태 초기화
  resetData: () => set({
    diaries: [],
    filteredDiaries: [],
    selectedDate: null,
    error: null
  })
}));

export default useFriendDiaryStore;