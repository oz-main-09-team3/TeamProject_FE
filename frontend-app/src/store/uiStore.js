import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUiStore = create((set, get) => ({
  // 상태
  isDarkMode: null, // null = 시스템 기본값, true = 다크 모드, false = 라이트 모드
  
  // 초기화 - 앱 로드 시 호출
  initializeUI: async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('theme');
      
      if (storedTheme !== null) {
        // 저장된 테마가 있으면 사용
        set({ isDarkMode: storedTheme === 'dark' });
      } else {
        // 저장된 테마가 없으면 null로 유지 (시스템 기본값)
        set({ isDarkMode: null });
      }
    } catch (error) {
      console.error('테마 설정 로드 실패:', error);
      // 오류 발생 시 기본값 (시스템 테마)
      set({ isDarkMode: null });
    }
  },
  
  // 다크 모드 토글
  toggleDarkMode: async (forcedValue) => {
    try {
      const newValue = forcedValue !== undefined ? forcedValue : !get().isDarkMode;
      
      // 상태 업데이트
      set({ isDarkMode: newValue });
      
      // 저장
      await AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
    } catch (error) {
      console.error('테마 설정 저장 실패:', error);
    }
  },
}));

export default useUiStore;