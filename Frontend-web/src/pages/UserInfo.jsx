import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import useAuthStore from "../store/authStore";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { formatPhoneNumber, formatDateYYYYMMDD } from "../utils/dateUtils";

// CloudFront URL 상수 정의
const CLOUDFRONT_URL = "https://dpjpkgz1vl8qy.cloudfront.net";
const S3_URL_PATTERN = /https:\/\/handsomepotato\.s3\.ap-northeast-2\.amazonaws\.com/;

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

  // 프로필 이미지 URL 생성 - CloudFront URL 사용으로 수정
  const getProfileImageUrl = () => {
    if (!user?.profile) return "/profile.png"; // 프로필이 없으면 기본 이미지 사용
    
    const imageUrl = user.profile;
    
    // 이미 로컬 상대 경로인 경우 그대로 사용
    if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) return imageUrl;
    
    // S3 URL을 CloudFront URL로 대체
    if (imageUrl.match(S3_URL_PATTERN)) {
      // S3 URL 패턴에서 /media/ 이후 경로만 추출
      const pathMatch = imageUrl.match(/\/media\/(.+)$/);
      if (pathMatch && pathMatch[1]) {
        return `${CLOUDFRONT_URL}/media/${pathMatch[1]}`;
      }
    }
    
    // 이미 CloudFront URL인 경우 그대로 사용
    if (imageUrl.startsWith(CLOUDFRONT_URL)) return imageUrl;
    
    // HTTPS로 시작하는 URL (외부 이미지)
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // 상대 경로인 경우 CloudFront URL에 추가
    return `${CLOUDFRONT_URL}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
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