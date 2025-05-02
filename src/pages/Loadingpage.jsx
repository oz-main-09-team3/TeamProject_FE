import React, { useEffect, useState } from "react";
import loadingLight from "../assets/Phone - l.svg";
import loadingDark from "../assets/Phone - D.svg";
import loadingWebDark from "../assets/LoadingPageD.png";
import loadingWebLight from "../assets/LoadingPage.png"; 
import kakaoLoginImg from "../assets/kakaotalk.png";
import naverLoginImg from "../assets/btnW_아이콘사각.png";
import googleLoginImg from "../assets/web_light_sq_na@1x.png";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const redirectUriKakao = "http://localhost:5173/auth/callback/kakao";
const redirectUriNaver = "http://localhost:5173/auth/callback/naver";
const redirectUriGoogle = "http://localhost:5173/auth/callback/google";

const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${redirectUriKakao}&response_type=code`;
const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${redirectUriNaver}&response_type=code&state=randomstring`;
const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUriGoogle}&response_type=code&scope=profile email&access_type=offline&prompt=consent`;

const LoadingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    () =>
      localStorage.getItem("theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          const hasDarkClass = document.documentElement.classList.contains("dark");
          setIsDarkMode(hasDarkClass);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setIsDarkMode(e.newValue === "dark");
      }
    };
    window.addEventListener("storage", handleStorageChange);

    setIsDarkMode(
      localStorage.getItem("theme") === "dark" ||
      (localStorage.getItem("theme") === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getBackgroundImage = () => {
    if (isMobile) {
      return isDarkMode ? loadingDark : loadingLight;
    } else {
      return isDarkMode ? loadingWebDark : loadingWebLight;
    }
  };

  return (
    <div className="relative flex justify-center items-center w-screen h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      />

      {/* 로그인 버튼 영역 */}
      <div className="absolute bottom-[20%] right-[20%] z-10 
                md:bottom-[20%] md:right-[10%] 
                sm:bottom-[50%] sm:right-[30%] 
                max-sm:bottom-[5%] max-sm:right-[15%]">        
                <div className="flex flex-row justify-center space-x-4">
          {/* 카카오 로그인 */}
          <button
            className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            aria-label="카카오 로그인"
            onClick={() => (window.location.href = kakaoLoginUrl)}
          >
            <img
              src={kakaoLoginImg}
              alt="카카오 로그인"
              className="w-full h-auto"
            />
          </button>

          {/* 네이버 로그인 */}
          <button
            className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            aria-label="네이버 로그인"
            onClick={() => (window.location.href = naverLoginUrl)}
          >
            <img
              src={naverLoginImg}
              alt="네이버 로그인"
              className="w-full h-auto"
            />
          </button>

          {/* 구글 로그인 */}
          <button
            className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            aria-label="구글 로그인"
            onClick={() => (window.location.href = googleLoginUrl)}
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