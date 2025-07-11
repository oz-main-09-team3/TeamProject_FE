import { useEffect } from "react";
import RowCard from "../components/RowCard";
import { ArrowRight, Search } from "lucide-react";
import testimage from "../assets/profile.png";
import emptyImage from "../assets/empty.png";
import { useNavigate } from "react-router-dom";
import useFriendStore from "../store/friendStore";

// CloudFront URL 및 S3 URL 상수 정의
const CLOUDFRONT_URL = "https://dpjpkgz1vl8qy.cloudfront.net";
const S3_URL_PATTERN = /https:\/\/handsomepotato\.s3\.ap-northeast-2\.amazonaws\.com/;

/**
 * S3 URL을 CloudFront URL로 변환하는 함수
 * @param {string} profilePath - 프로필 이미지 경로 또는 URL
 * @returns {string} CloudFront URL을 사용하는 이미지 URL
 */
const getProfileImageUrl = (profilePath) => {
  if (!profilePath) return testimage; // 프로필 이미지가 없으면 기본 이미지 사용
  
  // S3 URL을 CloudFront URL로 대체
  if (profilePath.match(S3_URL_PATTERN)) {
    // S3 URL 패턴에서 /media/profiles/ 이후 경로만 추출
    const pathMatch = profilePath.match(/\/media\/profiles\/(.+)$/);
    if (pathMatch && pathMatch[1]) {
      return `${CLOUDFRONT_URL}/media/profiles/${pathMatch[1]}`;
    }
  }
  
  // 이미 CloudFront URL인 경우 그대로 사용
  if (profilePath.startsWith(CLOUDFRONT_URL)) return profilePath;
  
  // 상대 경로인 경우 CloudFront URL에 추가
  if (!profilePath.startsWith('http')) {
    const path = profilePath.startsWith('/') ? profilePath.slice(1) : profilePath;
    return `${CLOUDFRONT_URL}/${path}`;
  }
  
  // 그 외의 경우 원본 URL 반환
  return profilePath;
};

/**
 * 친구 목록을 보여주는 컴포넌트
 * API 연동된 친구 목록 표시 및 검색 기능 제공
 */
export default function FriendsList({ onFriendClick }) {
  const navigate = useNavigate();
  
  // Zustand 스토어 사용
  const { 
    filteredFriends, 
    searchTerm, 
    isLoading, 
    error, 
    fetchFriends, 
    setSearchTerm 
  } = useFriendStore();

  // 컴포넌트 마운트 시 친구 목록 데이터 가져오기
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // 친구 클릭 핸들러
  const handleFriendClick = (friend) => {
    if (onFriendClick) onFriendClick();
    // 친구 ID를 사용하여 상세 페이지로 이동
    navigate(`/friend-calendar/${friend.id}`);
  };

  // 로딩 중 상태 표시
  if (isLoading) {
    return (
      <div className="friends-panel flex flex-col w-full items-center justify-center min-h-[200px]">
        <p className="text-lighttext dark:text-darktext">로딩 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="friends-panel flex flex-col w-full items-center justify-center min-h-[200px]">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-lightOrange dark:bg-darkOrange rounded-md text-white"
          onClick={() => fetchFriends()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="friends-panel flex flex-col w-full text-lighttext dark:text-darktext text-xl">
      {/* 검색창 컴포넌트 */}
      <div className="flex items-center gap-2 mb-4 px-4 py-1 bg-white dark:bg-darkBrown rounded-full shadow focus-within:ring-2 focus-within:ring-lightOrange dark:focus-within:ring-darkOrange transition-all text-2xl">
        <Search size={16} className="text-lighttext dark:text-darktext" />
        <input
          type="text"
          placeholder="친구 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent flex-1 p-1 outline-none focus:outline-none focus:shadow-none text-lighttext dark:text-darktext placeholder-lighttext dark:placeholder-darktext text-sm"
          style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
        />
      </div>

      {/* 친구 리스트 컴포넌트 */}
      <div className="flex flex-col gap-2 P-1 flex-1 justify-center items-center min-h-[200px]">
        {filteredFriends.length > 0 ? (
          // 검색 결과가 있을 경우 친구 목록 표시
          filteredFriends.map((friend) => (
            <RowCard
              key={friend.id}
              emojiSrc={getProfileImageUrl(friend.profile)}
              headerText={friend.nickname || "친구"}
              rightIcon={
                <ArrowRight
                  size={22}
                  className="text-lighttext dark:text-darktext"
                />
              }
              onClick={() => handleFriendClick(friend)}
            />
          ))
        ) : (
          // 검색 결과가 없을 경우 빈 상태 표시
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src={emptyImage}
              alt="검색 결과 없음"
              className="w-24 h-24 mb-2 opacity-80"
            />
            <p className="text-lg text-gray-400">
              {searchTerm ? "찾을 수 없는 친구입니다." : "친구 목록이 없습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}