import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import useAuthStore from "../store/authStore";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { formatPhoneNumber, formatDateYYYYMMDD } from "../utils/dateUtils";

const UserInfo = () => {
  const navigate = useNavigate();
  
  // Zustand 스토어 사용
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    fetchUserInfo 
  } = useAuthStore();

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, fetchUserInfo, navigate]);

  // 프로필 이미지 URL 생성
  const getProfileImageUrl = () => {
    if (user?.profile) {
      const imageUrl = user.profile;
      // 절대 경로인 경우 그대로 사용
      if (imageUrl.startsWith('https')) {
        return imageUrl;
      }
      // 상대 경로인 경우 백엔드 URL과 결합
      return `${import.meta.env.VITE_BACKEND_URL}${imageUrl}`;
    }
    // 기본 이미지
    return "/profile.png";
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
          <div
            className="w-[184px] h-[184px] rounded-full overflow-hidden shadow-xl border-4"
            style={{ borderColor: "transparent" }}
          >
            <img
              src={getProfileImageUrl()}
              alt={user?.nickname || "프로필 이미지"}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/profile.png"; }}
            />
          </div>
        </div>

        {/* 회원 정보 내용 */}
        <div className="w-full mt-2 px-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-lighttext dark:text-darkBg">닉네임</span>
                <span className="text-lighttext dark:text-darkBg">{user?.nickname || "정보 없음"}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold text-lighttext dark:text-darkBg">전화번호</span>
                <span className="text-lighttext dark:text-darkBg">{formatPhoneNumber(user?.phone_num)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold text-lighttext dark:text-darkBg">이메일</span>
                <span className="text-lighttext dark:text-darkBg">{user?.email || "정보 없음"}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold text-lighttext dark:text-darkBg">생년월일</span>
                <span className="text-lighttext dark:text-darkBg">{formatDateYYYYMMDD(user?.birth_date || user?.birthday)}</span>
              </div>
            </div>

            {/* 회원 정보 수정 버튼 */}
            <Button
              onClick={() => {
                navigate("/mypage/edit", { state: { userInfo: user } });
              }}
            >
              회원 정보 수정
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserInfo;