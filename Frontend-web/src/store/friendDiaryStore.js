import { create } from 'zustand';
import { fetchFriendDiaryCalendar, fetchFriendDiaryByDate } from '../service/friendDiaryApi';
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
  
  // 선택된 날짜 설정 및 해당 날짜의 일기 불러오기
  setSelectedDate: (date) => {
    const { friendId } = get(); // Zustand 스토어의 현재 상태에서 friendId 가져오기
    
    set({ selectedDate: date });
    
    if (date && friendId) {
      // 날짜가 선택되면 해당 날짜의 일기 목록 가져오기
      get().fetchDiariesByDate(friendId, date);
    } else {
      // 날짜 선택이 해제되면 전체 일기 목록으로 복원
      const { diaries } = get();
      set({ filteredDiaries: diaries });
    }
  },
  
  // 이모션 데이터 가져오기
  fetchEmotions: async () => {
    try {
      console.log('이모션 데이터 요청 중...');
      
      // fetchEmotions 함수 사용 (수정된 부분)
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
  
  // 특정 날짜의 일기 목록 가져오기
  fetchDiariesByDate: async (friendId, date) => {
    if (!friendId || !date) return;
    
    set({ isLoading: true, error: null });
    
    try {
      console.log(`친구 ID ${friendId}의 ${date} 일기 목록 요청 중...`);
      
      // 특정 날짜의 일기 목록을 가져오는 API 호출
      const response = await fetchFriendDiaryByDate(friendId, date);
      
      // API 응답 전체를 자세히 콘솔에 출력
      console.log('----- 특정 날짜 일기 목록 API 응답 시작 -----');
      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);
      console.log('응답 데이터:', response.data);
      
      // 응답 데이터가 배열인지 확인
      console.log('응답 데이터 타입:', typeof response.data);
      console.log('응답 데이터는 배열인가?', Array.isArray(response.data));
      
      // 배열인 경우 첫 번째 항목 상세 분석
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('첫 번째 일기 항목:', response.data[0]);
        console.log('첫 번째 일기 속성 목록:', Object.keys(response.data[0]));
        
        // emotion 객체 구조 확인
        if (response.data[0].emotion) {
          console.log('이모션 객체 구조:', response.data[0].emotion);
          console.log('이모션 객체 속성 목록:', Object.keys(response.data[0].emotion));
        }
        
        // user 객체 구조 확인
        if (response.data[0].user) {
          console.log('사용자 객체 구조:', response.data[0].user);
          console.log('사용자 객체 속성 목록:', Object.keys(response.data[0].user));
        }
      }
      console.log('----- 특정 날짜 일기 목록 API 응답 끝 -----');
      
      // API 응답으로 받은 일기 목록
      const diariesForDate = response.data;
      
      // 데이터 구조를 표준화하여 캘린더 데이터와 호환되도록 변환
      const transformedDiaries = diariesForDate.map(diary => {
        const transformed = {
          diary_id: diary.id, // id를 diary_id로 변환
          content: diary.content,
          date: date, // date 파라미터 사용 (YYYY-MM-DD 형식)
          emotion_id: null,
          emoji: null,
          title: diary.content ? (diary.content.substring(0, 20) + (diary.content.length > 20 ? '...' : '')) : '',
          created_at: diary.created_at,
          updated_at: diary.updated_at,
          user: diary.user,
          like_count: diary.like_count
        };
        
        // emotion 객체가 있는 경우 emotion_id와 emoji 설정
        if (diary.emotion) {
          transformed.emotion_id = diary.emotion.id || null;
          transformed.emoji = diary.emotion.emoji || null;
          transformed.emotion = diary.emotion; // 원본 emotion 객체도 유지
        }
        
        return transformed;
      });
      
      console.log('변환된 특정 날짜 일기 목록:', transformedDiaries);
      
      // 필터링된 일기 목록만 업데이트 (달력 데이터는 그대로 유지)
      set({ 
        filteredDiaries: transformedDiaries,
        isLoading: false 
      });
      
      return transformedDiaries;
    } catch (error) {
      console.error(`${date}의 일기 목록 로딩 중 오류 발생:`, error);
      
      // 오류 응답 상세 분석
      if (error.response) {
        console.error('오류 응답 상태:', error.response.status);
        console.error('오류 응답 데이터:', error.response.data);
        console.error('오류 응답 헤더:', error.response.headers);
      } else if (error.request) {
        console.error('요청은 전송되었으나 응답이 없음:', error.request);
      } else {
        console.error('요청 설정 중 오류 발생:', error.message);
      }
      
      set({ 
        error: "해당 날짜의 일기를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.",
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