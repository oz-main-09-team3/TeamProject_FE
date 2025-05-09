import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const path = location.pathname;
     console.log(path)
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

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const BACKEND_URL = import.meta.env. VITE_BACKEND_URL;
    
    console.log(`=== ${provider} 인가 코드 백엔드 전송 ===`);
    console.log("Provider:", provider);
    console.log("Authorization Code:", code);
    console.log("Backend URL:", `${BASE_URL}/oauth/${provider}/callback`);

    fetch(`${BACKEND_URL}/auth/login/${provider}/`, {
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
/*
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("세션 확인 실패:", error.message);
        alert("로그인 세션을 불러오지 못했습니다.");
        navigate("/");
        return;
      }

      if (data?.session) {
        const user = data.session.user;
        console.log("로그인 성공, 사용자:", user);

        // 토큰과 사용자 정보 저장 (원한다면)
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("refresh_token", data.session.refresh_token);
        localStorage.setItem("user", JSON.stringify(user));

        // 메인 페이지로 이동
        navigate("/main");
      } else {
        alert("로그인 세션이 없습니다.");
        navigate("/");
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}
  */