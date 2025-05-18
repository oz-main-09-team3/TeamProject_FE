import { create } from 'zustand';
import { 
  fetchDiaries, 
  fetchDiary, 
  createDiary, 
  updateDiary, 
  deleteDiary,
  fetchEmotions
} from '../service/diaryApi';
import { addLike, removeLike } from '../service/likeApi';

const useDiaryStore = create((set, get) => ({
  // 상태
  diaries: [],
  filteredDiaries: [],
  currentDiary: null,
  emotions: {},
  selectedDate: null,
  isLoading: false,
  error: null,
  
  // 액션
  fetchEmotions: async () => {
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
        set({ emotions });
        return emotions;
      }
      return {};
    } catch (err) {
      set({ error: err.message });
      return {};
    }
  },
  
  fetchDiaries: async () => {
    set({ isLoading: true, error: null });
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
        throw new Error("예상치 못한 데이터 구조입니다.");
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
          liked: diary.is_liked || false,
          emotionId: emotionValue,
          emotion: diary.emotion,
          createdAt: diary.created_at,
          profileUrl: diary.profile,
          user: diary.user,
        };
      });
      
      set({ 
        diaries: formattedDiaries, 
        filteredDiaries: formattedDiaries, 
        isLoading: false 
      });
      return formattedDiaries;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return [];
    }
  },
  
  fetchDiary: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchDiary(id);
      
      const diaryData = response.data || response;
      
      // 좋아요 상태 확인 (is_liked 필드가 있으면 사용)
      const isLiked = diaryData.is_liked !== undefined ? diaryData.is_liked : false;
      
      const formattedDiary = {
        diary_id: diaryData.diary_id,
        id: diaryData.diary_id,
        content: diaryData.content || "",
        date: new Date(diaryData.created_at).toLocaleDateString('ko-KR'),
        emotionId: diaryData.emotion?.emotion_id || 1,
        emotionText: diaryData.emotion?.emotion || "",
        emotionEmoji: diaryData.emotion?.emoji || "",
        emotionUrl: diaryData.emotion?.image_url || "",
        userId: diaryData.user?.user_id,
        userName: diaryData.user?.username,
        userNickname: diaryData.user?.nickname,
        userProfile: diaryData.user?.profile,
        liked: isLiked,
        likeCount: diaryData.like_count || 0,
        visibility: diaryData.visibility,
        images: diaryData.images || [],
        comments: diaryData.comments || [],
        createdAt: diaryData.created_at,
        updatedAt: diaryData.updated_at
      };
      
      set({ currentDiary: formattedDiary, isLoading: false });
      return formattedDiary;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },
  
  createDiary: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createDiary(data);
      await get().fetchDiaries(); // 목록 새로고침
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
  
  updateDiary: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateDiary(id, data);
      
      // 현재 일기 정보 업데이트
      if (get().currentDiary?.id === id) {
        set({ currentDiary: { ...get().currentDiary, ...response.data } });
      }
      
      // 목록의 일기 정보도 업데이트
      set(state => ({
        diaries: state.diaries.map(diary => 
          diary.id === id ? { ...diary, ...response.data } : diary
        ),
        filteredDiaries: state.filteredDiaries.map(diary => 
          diary.id === id ? { ...diary, ...response.data } : diary
        )
      }));
      
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
  
  deleteDiary: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDiary(id);
      
      // 삭제된 일기를 목록에서 제거
      set(state => ({
        diaries: state.diaries.filter(diary => diary.id !== id),
        filteredDiaries: state.filteredDiaries.filter(diary => diary.id !== id),
        currentDiary: state.currentDiary?.id === id ? null : state.currentDiary,
        isLoading: false
      }));
      
      return true;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
  
setSelectedDate: (dateKey) => {
  // null이 전달되면 (전체 보기) 모든 일기를 표시
  if (dateKey === null) {
    set({ 
      selectedDate: null,
      filteredDiaries: get().diaries
    });
    return;
  }
  
  const currentSelectedDate = get().selectedDate;
  
  if (currentSelectedDate === dateKey) {
    // 같은 날짜를 다시 클릭하면 선택 해제
    set({ 
      selectedDate: null,
      filteredDiaries: get().diaries
    });
  } else {
    // 새 날짜 선택
    const filtered = get().diaries.filter(diary => {
      const diaryDate = new Date(diary.createdAt);
      const diaryDateKey = `${diaryDate.getFullYear()}-${(diaryDate.getMonth() + 1).toString().padStart(2, '0')}-${diaryDate.getDate().toString().padStart(2, '0')}`;
      return diaryDateKey === dateKey;
    });
    
    set({ 
      selectedDate: dateKey,
      filteredDiaries: filtered
    });
  }
},
  
  toggleLike: async (id) => {
    try {
      const diary = get().diaries.find(d => d.id === id) || get().currentDiary;
      
      if (!diary) return false;
      
      const newLikedStatus = !diary.liked;
      
      // 상태 미리 업데이트 (낙관적 업데이트)
      set(state => ({
        diaries: state.diaries.map(d => 
          d.id === id ? { ...d, liked: newLikedStatus } : d
        ),
        filteredDiaries: state.filteredDiaries.map(d => 
          d.id === id ? { ...d, liked: newLikedStatus } : d
        ),
        currentDiary: state.currentDiary?.id === id
          ? { ...state.currentDiary, liked: newLikedStatus }
          : state.currentDiary
      }));
      
      // API 호출
      if (newLikedStatus) {
        await addLike(id);
      } else {
        await removeLike(id);
      }
      
      return true;
    } catch (err) {
      // 오류 발생 시 원래 상태로 롤백
      const originalLikedStatus = !get().diaries.find(d => d.id === id)?.liked;
      
      set(state => ({
        diaries: state.diaries.map(d => 
          d.id === id ? { ...d, liked: originalLikedStatus } : d
        ),
        filteredDiaries: state.filteredDiaries.map(d => 
          d.id === id ? { ...d, liked: originalLikedStatus } : d
        ),
        currentDiary: state.currentDiary?.id === id
          ? { ...state.currentDiary, liked: originalLikedStatus }
          : state.currentDiary,
        error: err.message
      }));
      
      return false;
    }
  },

  clearError: () => set({ error: null })
}));

export default useDiaryStore;