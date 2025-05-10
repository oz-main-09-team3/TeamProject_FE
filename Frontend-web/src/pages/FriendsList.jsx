import RowCard from "../components/RowCard";
import { ArrowRight, Search } from "lucide-react";
import testimage from "../assets/profile.png";
import emptyImage from "../assets/empty.png";
import { useSearch } from "../hooks/useSearch";

/**
 * 친구 목록을 보여주는 컴포넌트
 * TODO: API 연동 후 하드코딩된 데이터를 API 호출로 대체
 * TODO: 친구 클릭 시 상세 페이지로 이동하는 기능 추가
 */
export default function FriendsList() {
  // 임시 친구 목록 데이터 (API 연동 시 제거)
  const friends = [
    "김오즈",
    "홍길동",
    "엄세욱",
    "김은지",
    "정봉석",
    "김오즈",
    "홍길동",
  ];

  // 검색 기능을 위한 커스텀 훅 사용
  const { searchTerm, setSearchTerm, filteredItems: filteredFriends } = useSearch(friends);

  return (
    <div className="flex flex-col gap-4 w-full text-lighttext dark:text-darktext">
      {/* 검색창 컴포넌트 */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-lightBg dark:bg-darkBrown rounded">
        <Search size={20} className="text-lighttext dark:text-darktext" />
        <input
          type="text"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none flex-1 text-lighttext dark:text-darktext placeholder-lighttext dark:placeholder-darktext"
        />
      </div>

      {/* 친구 리스트 컴포넌트 */}
      <div className="flex flex-col gap-3 flex-1 justify-center items-center min-h-[200px]">
        {filteredFriends.length > 0 ? (
          // 검색 결과가 있을 경우 친구 목록 표시
          filteredFriends.map((friend, index) => (
            <RowCard
              key={index}
              emojiSrc={testimage}
              headerText={friend}
              rightIcon={
                <ArrowRight
                  size={20}
                  className="text-lighttext dark:text-darkCopper"
                />
              }
              onClick={() => console.log(`${friend} 클릭됨`)}
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
            <p className="text-sm text-gray-400">친구 목록이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
