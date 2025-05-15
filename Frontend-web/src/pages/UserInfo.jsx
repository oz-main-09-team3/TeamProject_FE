import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getMyInfo } from "../service/userApi";
import BackButton from "../components/BackButton";

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
      <div className="w-full max-w-md relative pt-[100px] pb-8 flex flex-col gap-3 items-center bg-yl100 dark:bg-darktext rounded-3xl shadow-lg">
        {/* 뒤로 가기 버튼 */}
        <BackButton to="/mypage" />
        
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
        <div className="w-full mt-2 px-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-lighttext dark:text-darkBg">닉네임</span>
                <span className="text-lighttext dark:text-darkBg">{userInfo?.nickname || "정보 없음"}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold text-lighttext dark:text-darkBg">전화번호</span>
                <span className="text-lighttext dark:text-darkBg">{userInfo?.phone_num || "정보 없음"}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold text-lighttext dark:text-darkBg">이메일</span>
                <span className="text-lighttext dark:text-darkBg">{userInfo?.email || "정보 없음"}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold text-lighttext dark:text-darkBg">생년월일</span>
                <span className="text-lighttext dark:text-darkBg">{formatDate(userInfo?.birth_date || userInfo?.birthday)}</span>
              </div>
            </div>

            {/* 회원 정보 수정 버튼 */}
            <button
              onClick={() => navigate("/mypage/edit", { state: { userInfo } })}
              className="w-full p-1.5 rounded-full font-semibold transition bg-lightGold hover:bg-lightOrange dark:bg-darkOrange dark:hover:bg-darkCopper dark:text-darkBg"
            >
              회원 정보 수정
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}