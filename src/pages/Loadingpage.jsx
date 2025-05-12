import { MoonIcon, SunIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loadingWebLight from "../assets/LoadingPage.png";
import loadingWebDark from "../assets/LoadingPageD.png";
import loadingDark from "../assets/Phone - D.svg";
import loadingLight from "../assets/Phone - l.svg";
import naverLoginImg from "../assets/btnW_아이콘사각.png";
import kakaoLoginImg from "../assets/kakaotalk.png";
import googleLoginImg from "../assets/web_light_sq_na@1x.png";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 환경에 따라 다른 redirect URI 설정
const BASE_URL = import.meta.env.VITE_BASE_URL || "";

const redirectUriKakao = `${BASE_URL}/auth/callback/kakao`;
const redirectUriNaver = `${BASE_URL}/auth/callback/naver`;
const redirectUriGoogle = `${BASE_URL}/auth/callback/google`;

const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  redirectUriKakao
)}&response_type=code`;
const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  redirectUriNaver
)}&response_type=code&state=randomstring`;
const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  redirectUriGoogle
)}&response_type=code&scope=profile email&access_type=offline&prompt=consent`;

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
    mediaQuery.addEventListener("change", handleChange);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

// LoadingPage 컴포넌트
const LoadingPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDarkMode = matchMedia("(prefers-color-scheme: dark)").matches;
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
      return isDarkMode ? loadingDark : loadingLight;
    } else {
      return isDarkMode ? loadingWebDark : loadingWebLight;
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogin = (url) => {
    document.location.href = url;
  };

  return (
    <div className="relative flex justify-center items-center w-screen h-screen overflow-hidden">
      <div className="absolute top-6 right-6 z-50 flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {isDarkMode ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>

        <Link
          to="/main"
          className="px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-600 dark:text-gray-200 text-gray-700"
        >
          메인페이지
        </Link>
      </div>

      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      />

      <div
        className="absolute bottom-[20%] right-[20%] z-10 
                md:bottom-[20%] md:right-[10%] 
                sm:bottom-[50%] sm:right-[30%] 
                max-sm:bottom-[5%] max-sm:right-[15%]"
      >
        <div className="flex flex-row justify-center space-x-4">
          <button
            className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            aria-label="카카오 로그인"
            onClick={() => handleLogin(kakaoLoginUrl)}
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
            onClick={() => handleLogin(naverLoginUrl)}
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
            onClick={() => handleLogin(googleLoginUrl)}
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

export default LoadingPage;
/*
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import loadingLight from "../assets/Phone - l.svg";
import loadingDark from "../assets/Phone - D.svg";
import loadingWebDark from "../assets/LoadingpageD.png";
import loadingWebLight from "../assets/Loadingpage.png"; 
import kakaoLoginImg from "../assets/kakaotalk.png";
import naverLoginImg from "../assets/btnW_아이콘사각.png";
import googleLoginImg from "../assets/web_light_sq_na@1x.png";
import { SunIcon, MoonIcon } from "lucide-react";
import { supabase } from '../lib/supabase';

// 환경에 따라 다른 redirect URI 설정
const BASE_URL = import.meta.env.VITE_BASE_URL || '';

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

// LoadingPage 컴포넌트
const LoadingPage = () => {
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
      return isDarkMode ? loadingDark : loadingLight;
    } else {
      return isDarkMode ? loadingWebDark : loadingWebLight;
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback/${provider}`,
      },
    });
    if (error) {
      console.error(`${provider} 로그인 오류:`, error.message);
    }
  };
  

  return (
    <div className="relative flex justify-center items-center w-screen h-screen overflow-hidden">
      <div className="absolute top-6 right-6 z-50 flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
        
        <Link 
          to="/main" 
          className="px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-600 dark:text-gray-200 text-gray-700"
        >
          메인페이지
        </Link>
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
            onClick={() => handleLogin()}
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
            onClick={() => handleLogin()}
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

export default LoadingPage;
*/
