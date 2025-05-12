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
    <div className="friends-panel flex flex-col w-full text-lighttext dark:text-darktext text-xl">
      {/* 검색창 컴포넌트 */}
      <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-white dark:bg-darkBrown rounded-full shadow focus-within:ring-2 focus-within:ring-lightOrange dark:focus-within:ring-darkOrange transition-all text-2xl">
        <Search size={20} className="text-lighttext dark:text-darktext" />
        <input
          type="text"
          placeholder="친구 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent flex-1 px-2 outline-none focus:outline-none focus:shadow-none text-lighttext dark:text-darktext placeholder-lighttext dark:placeholder-darktext"
          style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
        />
      </div>

      {/* 친구 리스트 컴포넌트 */}
      <div className="flex flex-col gap-2 P-1 flex-1 justify-center items-center min-h-[200px]">
        {filteredFriends.length > 0 ? (
          // 검색 결과가 있을 경우 친구 목록 표시
          filteredFriends.map((friend, index) => (
            <RowCard
              key={index}
              emojiSrc={testimage}
              headerText={friend}
              rightIcon={
                <ArrowRight
                  size={22}
                  className="text-lighttext dark:text-darktext"
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
            <p className="text-lg text-gray-400">
              {searchTerm ? "찾을 수 없는 친구입니다." : "친구 목록이 없습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
