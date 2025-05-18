import { useEffect, useState } from "react";
import RowCard from "../components/RowCard";
import { ArrowRight, Search } from "lucide-react";
import testimage from "../assets/profile.png";
import emptyImage from "../assets/empty.png";
import { useSearch } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import { getFriendsList } from "../service/friendApi";

/**
 * 친구 목록을 보여주는 컴포넌트
 * API 연동된 친구 목록 표시 및 검색 기능 제공
 */
export default function FriendsList({ onFriendClick }) {
  const [friends, setFriends] = useState([]); // 친구 전체 목록 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 검색 기능을 위한 커스텀 훅 사용
  const { searchTerm, setSearchTerm, filteredItems: filteredFriends } = useSearch(friends);
  const navigate = useNavigate();

  //컴포넌트 마운트 시 친구 목록 API 호출
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        const response = await getFriendsList();
        console.log("친구 API 응답:", response);
        const friendsData = response.data;
        setFriends(friendsData);
      } catch (err) {
        console.error("❌ 친구 목록을 불러오는데 실패했습니다:", err);
        setError("친구 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // 친구 클릭 시 캘린더 페이지로 이동
  const handleFriendClick = (friend) => {
    if (onFriendClick) onFriendClick();
    navigate(`/friend-calendar/${friend.id}`);
  };

  //로딩 중 표시
  if (isLoading) {
    return (
      <div className="friends-panel flex flex-col w-full items-center justify-center min-h-[200px]">
        <p className="text-lighttext dark:text-darktext">로딩 중...</p>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className="friends-panel flex flex-col w-full items-center justify-center min-h-[200px]">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-lightOrange dark:bg-darkOrange rounded-md text-white"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="friends-panel flex flex-col w-full text-lighttext dark:text-darktext text-xl">
      {/* 🔍 검색창 */}
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

      {/* 친구 리스트 */}
      <div className="flex flex-col gap-2 P-1 flex-1 justify-center items-center min-h-[200px]">
        {filteredFriends.length > 0 ? (
          // 검색 결과가 있을 경우 친구 목록 표시
          filteredFriends.map((friend) => (
            <RowCard
              key={friend.id}
              emojiSrc={friend.profile || testimage}
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
          // ❌ 검색 결과 없을 때
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
