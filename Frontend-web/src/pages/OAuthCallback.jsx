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
    const redirectUri = `${window.location.origin}/auth/callback/${provider}`;
    const apiEndpoint = `${BACKEND_URL}/api/auth/login/${provider}/`;
    
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

      // access_token과 refresh_token으로 변경
      if (data.token) { // access_token → token으로 변경
  localStorage.setItem("token", data.token);
  console.log("token 저장됨");
}

      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
        console.log("refresh_token 저장됨");
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("user 정보 저장됨");
      }

      // 저장 확인
      console.log("=== 저장된 값 확인 ===");
      console.log("token:", localStorage.getItem("token"));
      console.log("refresh_token:", localStorage.getItem("refresh_token"));
      console.log("user:", localStorage.getItem("user"));

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