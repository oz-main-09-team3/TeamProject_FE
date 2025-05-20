import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const path = location.pathname;
    
    if (!code) {
      console.error("code가 없습니다");
      navigate("/"); // 모달 없이 바로 로그인 페이지로 이동
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
      navigate("/"); // 모달 없이 바로 로그인 페이지로 이동
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
          // 모달 없이 바로 메인 페이지로 이동
          navigate("/main");
        } else {
          // 실패 시 로그인 페이지로 이동
          navigate("/");
        }
      } catch (err) {
        console.error("로그인 처리 중 오류가 발생했습니다:", err.message);
        navigate("/");
      }
    };
    
    handleLogin();
    
    // 컴포넌트 언마운트 시 에러 상태 초기화
    return () => {
      clearError();
    };
  }, [location, navigate, login, clearError]);
  
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