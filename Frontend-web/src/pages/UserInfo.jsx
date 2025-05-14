import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getMyInfo } from "../service/userApi";

// 파일 상단에 추가
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserInfo() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const response = await getMyInfo();
        console.log("User info response:", response);
        
        // API 응답 구조에 따라 데이터 추출
        const userData = response.data || response;
        setUserInfo(userData);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 프로필 이미지 URL 생성
  const getProfileImageUrl = () => {
    if (userInfo?.profile) {
      const imageUrl = userInfo.profile;
      // 절대 경로인 경우 그대로 사용
      if (imageUrl.startsWith('https')) {
        return imageUrl;
      }
      // 상대 경로인 경우 백엔드 URL과 결합
      return `${BACKEND_URL}${imageUrl}`;
    }
    // 기본 이미지
    return "/profile.png";
  };

  // 날짜 포맷팅 (YYYY-MM-DD 형식으로)
  const formatDate = (dateString) => {
    if (!dateString) return "정보 없음";
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark">
        <div className="text-2xl text-lighttext dark:text-darktext">
          사용자 정보를 불러오는 중...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark">
        <div className="text-red-500">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark px-4">
      {/* 전체 카드: 프로필 + 회원 정보 */}
      <div className="w-full max-w-md bg-yl100 dark:bg-darktext rounded-3xl shadow-lg px-6 pt-[92px] pb-8 relative flex flex-col items-center">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate('/mypage')}
          className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors absolute left-4 top-4 z-10"
          title="뒤로 가기"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* 프로필 이미지 */}
        <div className="absolute -top-[92px]">
          <div className="w-[184px] h-[184px] rounded-full overflow-hidden shadow-md">
            <img
              src={getProfileImageUrl()}
              alt="프로필 이미지"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src = "/profile.png"; // 이미지 로드 실패 시 기본 이미지
              }}
            />
          </div>
        </div>

        {/* 회원 정보 내용 */}
        <div className="w-full mt-6 space-y-6 text-sm text-lighttext dark:text-darkBg">
          <div className="flex justify-between">
            <span className="font-semibold">닉네임</span>
            <span>{userInfo?.nickname || "정보 없음"}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-semibold">전화번호</span>
            <span>{userInfo?.phone_num || "정보 없음"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">이메일</span>
            <span>{userInfo?.email || "정보 없음"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">생년월일</span>
            <span>{formatDate(userInfo?.birth_date || userInfo?.birthday)}</span>
          </div>
        </div>

        {/* 회원 정보 수정 버튼 */}
        <button
          onClick={() => navigate("/mypage/edit", { state: { userInfo } })}
          className="w-full mt-10 py-3 rounded-full font-semibold transition bg-lightGold hover:bg-lightOrange dark:bg-darkOrange dark:hover:bg-darkCopper dark:text-darkBg"
        >
          회원 정보 수정
        </button>
      </div>
    </main>
  );
}