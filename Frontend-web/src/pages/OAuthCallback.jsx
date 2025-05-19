import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  const { openModal } = useUiStore();
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const path = location.pathname;
    
    if (!code) {
      console.error("code가 없습니다");
      openModal('error', {
        title: '로그인 오류',
        content: '인증 코드가 없습니다.',
        confirmText: '확인',
        onConfirm: () => navigate("/")
      });
      return;
    }
    
    let provider = "";
    if (path.includes("kakao")) {
      provider = "kakao";
    } else if (path.includes("naver")) {
      provider = "naver";
    } else if (path.includes("google")) {
      provider = "google";
    }
    
    if (!provider) {
      console.error("provider를 알 수 없습니다");
      openModal('error', {
        title: '로그인 오류',
        content: '지원하지 않는 로그인 방식입니다.',
        confirmText: '확인',
        onConfirm: () => navigate("/")
      });
      return;
    }
    
    const redirectUri = `${window.location.origin}/auth/callback/${provider}`;
    
    // Zustand 스토어의 login 액션 사용
    const handleLogin = async () => {
      try {
        const success = await login(provider, { 
          code, 
          redirect_uri: redirectUri 
        });
        
        if (success) {
          openModal('success', {
            title: '로그인 성공',
            content: `${provider} 로그인에 성공했습니다.`,
            confirmText: '확인',
            onConfirm: () => navigate("/main")
          });
        } else {
          openModal('error', {
            title: '로그인 실패',
            content: `${provider} 로그인에 실패했습니다. 다시 시도해주세요.`,
            confirmText: '확인',
            onConfirm: () => navigate("/")
          });
        }
      } catch (err) {
        openModal('error', {
          title: '로그인 실패',
          content: `로그인 처리 중 오류가 발생했습니다: ${err.message}`,
          confirmText: '확인',
          onConfirm: () => navigate("/")
        });
      }
    };
    
    handleLogin();
    
    // 컴포넌트 언마운트 시 에러 상태 초기화
    return () => {
      clearError();
    };
  }, [location, navigate, login, openModal, clearError]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">로그인 처리 중입니다...</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
