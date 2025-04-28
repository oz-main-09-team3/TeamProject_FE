import React from 'react';
import loadingBgImage from '../assets/LoadingPage.png';
import kakaoLoginImg from '../assets/kakaotalk.png';
import naverLoginImg from '../assets/btnW_아이콘사각.png';
import googleLoginImg from '../assets/web_light_sq_na@1x.png';

const LoadingPage = () => {
  return (
    <div className="relative flex justify-center items-center w-screen h-screen overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${loadingBgImage})` }}
      />
      
      <div className="absolute bottom-[20%] right-[20%] z-10 md:right-[20%] sm:right-1/2 sm:translate-x-1/2">
        <div className="flex flex-row justify-center space-x-4">
          <button className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <img 
              src={kakaoLoginImg} 
              alt="카카오 로그인" 
              className="w-full h-auto"
            />
          </button>
          
          <button className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <img 
              src={naverLoginImg} 
              alt="네이버 로그인" 
              className="w-full h-auto"
            />
          </button>
          
          <button className="w-20 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
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