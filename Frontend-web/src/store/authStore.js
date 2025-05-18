import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginGoogle, loginKakao, logout } from '../service/authApi';
import { getMyInfo, updateMyInfo, deleteAccount } from '../service/userApi';

const clearAuthStorage = () => {
  const authKeys = [
    'token',
    'refresh_token',
    'user',
    'auth-storage'
  ];
  
  authKeys.forEach(key => localStorage.removeItem(key));
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // 상태
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      
      // 액션
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      fetchUserInfo: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getMyInfo();
          const userData = response.data || response;
          set({ user: userData, isAuthenticated: true, isLoading: false });
          return userData;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return null;
        }
      },
      
      updateUserInfo: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await updateMyInfo(userData);
          const updatedUser = response.data || response;
          set({ user: updatedUser, isLoading: false });
          return updatedUser;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },
      
      login: async (provider, { code, redirect_uri }) => {
        set({ isLoading: true, error: null });
        try {
          const loginFn = provider === 'kakao' ? loginKakao : 
                          provider === 'google' ? loginGoogle : 
                          null;
                          
          if (!loginFn) throw new Error('지원하지 않는 로그인 제공자입니다.');
          
          const response = await loginFn({ code, redirect_uri });
          
          if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
          }
          
          // 로그인 성공 후 사용자 정보 가져오기
          await get().fetchUserInfo();
          set({ isAuthenticated: true, isLoading: false });
          return true;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await logout();
          // 헬퍼 함수를 사용하여 인증 관련 데이터 제거
          clearAuthStorage();
          set({ user: null, isAuthenticated: false, isLoading: false });
          return true;
        } catch (err) {
          // API 호출 실패해도 로컬은 로그아웃 처리
          clearAuthStorage();
          set({ user: null, isAuthenticated: false, error: err.message, isLoading: false });
          return true;
        }
      },
      
      deleteUserAccount: async () => {
        set({ isLoading: true });
        try {
          await deleteAccount();
          // 헬퍼 함수를 사용하여 인증 관련 데이터 제거
          clearAuthStorage();
          set({ user: null, isAuthenticated: false, isLoading: false });
          return true;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      // 보안을 위해 민감한 정보는 저장 대상에서 제외
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;