import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLoginApi, logoutApi } from '../service/authApi';
import { getMyInfoApi, updateMyInfoApi, deleteAccountApi } from '../service/userApi';

const useAuthStore = create((set, get) => ({
  // 상태
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  // 액션
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  // 사용자 정보 조회
  fetchUserInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return null;
      }
      
      const response = await getMyInfoApi();
      const userData = response.data || response;
      set({ user: userData, isAuthenticated: true, isLoading: false });
      return userData;
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err);
      set({ 
        error: err.message || '사용자 정보를 불러오는데 실패했습니다.', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 사용자 정보 업데이트
  updateUserInfo: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateMyInfoApi(userData);
      const updatedUser = response.data || response;
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (err) {
      console.error('사용자 정보 업데이트 실패:', err);
      set({ 
        error: err.message || '사용자 정보 업데이트에 실패했습니다.', 
        isLoading: false 
      });
      throw err;
    }
  },
  
  // 로그인
  login: async (provider, authData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createLoginApi(provider, authData);
      
      if (response.data?.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      
      // 로그인 성공 후 사용자 정보 가져오기
      await get().fetchUserInfo();
      set({ isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      console.error('로그인 실패:', err);
      set({ 
        error: err.message || '로그인에 실패했습니다.', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // 로그아웃
  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutApi();
      
      // 스토리지 정리
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refresh_token');
      
      set({ user: null, isAuthenticated: false, isLoading: false });
      return true;
    } catch (err) {
      console.error('로그아웃 실패:', err);
      
      // API 호출 실패해도 로컬은 로그아웃 처리
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refresh_token');
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: err.message || '로그아웃 중 오류가 발생했습니다.', 
        isLoading: false 
      });
      return true;
    }
  },
  
  // 회원 탈퇴
  withdraw: async () => {
    set({ isLoading: true });
    try {
      await deleteAccountApi();
      
      // 스토리지 정리
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refresh_token');
      
      set({ user: null, isAuthenticated: false, isLoading: false });
      return true;
    } catch (err) {
      console.error('회원 탈퇴 실패:', err);
      set({ 
        error: err.message || '회원 탈퇴 중 오류가 발생했습니다.', 
        isLoading: false 
      });
      throw err;
    }
  },
  
  // 에러 초기화
  clearError: () => set({ error: null })
}));

export default useAuthStore;