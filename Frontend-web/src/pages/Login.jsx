import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import loginLight from "../assets/Phone - l.svg";
import loginDark from "../assets/Phone - D.svg";
import loginWebDark from "../assets/LoginpageD.png";
import loginWebLight from "../assets/Loginpage.png"; 
import kakaoLoginImg from "../assets/kakaotalk.png";
import naverLoginImg from "../assets/btnW_아이콘사각.png";
import googleLoginImg from "../assets/web_light_sq_na@1x.png";
import { SunIcon, MoonIcon } from "lucide-react";

// 환경 변수
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const BASE_URL = import.meta.env.VITE_BASE_URL;

// 리다이렉트 URI 설정
const REDIRECT_URI = {
  kakao: `${window.location.origin}/auth/callback/kakao`,
  naver: `${window.location.origin}/auth/callback/naver`,
  google: `${window.location.origin}/auth/callback/google`
};
// 미디어 쿼리 훅
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = matchMedia(query);
    
    // 초기값 설정
    setMatches(mediaQuery.matches);
    
    // 리스너 함수
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    // 리스너 추가
    mediaQuery.addEventListener('change', handleChange);
    
    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  return matches;
};

// Loginpage 컴포넌트
const Loginpage = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDarkMode = matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === "dark" || (savedTheme === null && prefersDarkMode);
  });

  // 테마 변경 시 effect
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const getBackgroundImage = () => {
    if (isMobile) {
      return isDarkMode ? loginDark : loginLight;
    } else {
      return isDarkMode ? loginWebDark : loginWebLight;
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleLogin = (provider) => {
    let authUrl = '';
    const redirectUri = REDIRECT_URI[provider];

    switch (provider) {
      case 'kakao':
        authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
        break;
      case 'naver':
        authUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=randomstring`;
        break;
      case 'google':
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile email&access_type=offline&prompt=consent`;
        break;
      default:
        console.error('지원하지 않는 provider입니다.');
        return;
    }

    console.log('Redirect URI:', redirectUri); // 디버깅용
    window.location.href = authUrl;
  };

  return (
    <div className="relative flex justify-center items-center w-screen h-screen overflow-hidden">
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-lighttext dark:text-darktext hover:text-lightOrange dark:hover:text-darkOrange transition-colors p-2 rounded"
          aria-label="모드 전환"
        >
          {isDarkMode ? <SunIcon size={22} /> : <MoonIcon size={22} />}
        </button>
      </div>

      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      />

      <div className="absolute bottom-[20%] right-[20%] z-10 
                md:bottom-[20%] md:right-[10%] 
                sm:bottom-[50%] sm:right-[30%] 
                max-sm:bottom-[5%] max-sm:right-[15%]">        
        <div className="flex flex-row justify-center space-x-4">
          <button
            className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            aria-label="카카오 로그인"
            onClick={() => handleLogin('kakao')}
          >
            <img
              src={kakaoLoginImg}
              alt="카카오 로그인"
              className="w-full h-auto"
            />
          </button>

          <button
            className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            aria-label="네이버 로그인"
            onClick={() => handleLogin('naver')}
          >
            <img
              src={naverLoginImg}
              alt="네이버 로그인"
              className="w-full h-auto"
            />
          </button>

          <button
            className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            aria-label="구글 로그인"
            onClick={() => handleLogin('google')}
          >
            <img
              src={googleLoginImg}
              alt="구글 로그인"
              className="w-full h-auto"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;