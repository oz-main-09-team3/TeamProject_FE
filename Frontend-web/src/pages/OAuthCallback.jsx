import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
    
    // 1. 리다이렉트 URI 수정 - 실제 현재 경로 사용 (중요!)
const redirectUri = `${window.location.origin}/auth/callback/${provider}`;


    
    // 2. API 엔드포인트 확인
    const apiEndpoint = `${BACKEND_URL}/api/auth/login/${provider}/`; // '/api/' 추가 확인
    
    console.log(`=== ${provider} 인가 코드 백엔드 전송 ===`);
    console.log("Provider:", provider);
    console.log("Authorization Code:", code);
    console.log("Redirect URI:", redirectUri);
    console.log("API Endpoint:", apiEndpoint);
    
    const requestData = {
      code: code,
      redirect_uri: redirectUri
    };
    
    console.log("전송 데이터:", JSON.stringify(requestData));

    axios.post(apiEndpoint, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, 
    })
    .then((res) => {
      const data = res.data;
      console.log("백엔드 응답 성공:", data);

      if (data.access) {
        localStorage.setItem("token", data.access);
      }

      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/main");
    })
    .catch((err) => {
      console.error("로그인 처리 실패:", err);
      console.error("에러 상세:", err.response ? err.response.data : 'No response data');
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