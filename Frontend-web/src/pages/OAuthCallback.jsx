import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const path = location.pathname;

    if (!code) {
      console.error("code가 없습니다");
      navigate("/");
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
      navigate("/");
      return;
    }

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    console.log(`=== ${provider} 인가 코드 백엔드 전송 ===`);
    console.log("Provider:", provider);
    console.log("Authorization Code:", code);
    console.log("Backend URL:", `${BACKEND_URL}/oauth/${provider}/callback`);

    fetch(`${BACKEND_URL}/oauth/${provider}/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        code: code,
        redirect_uri: `${window.location.origin}/auth/callback/${provider}`
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          console.error("백엔드 응답 에러:", errorData);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("백엔드 응답 성공:", data);
        
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("JWT 토큰 저장됨");
        }
        
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
          console.log("리프레시 토큰 저장됨");
        }
        
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("사용자 정보 저장됨");
        }
        
        navigate("/main");
      })
      .catch((err) => {
        console.error("로그인 처리 실패:", err);
        alert(`${provider} 로그인에 실패했습니다. 다시 시도해주세요.`);
        navigate("/");
      });
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}