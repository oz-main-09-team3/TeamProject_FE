import RowCard from "../components/RowCard";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import testimage from "../assets/profile.png";
import emptyImage from "../assets/없습니다.png";

export default function FriendList() {
  const [searchTerm, setSearchTerm] = useState("");

  const friends = [
    "김오즈",
    "홍길동",
    "엄세욱",
    "김은지",
    "정봉석",
    "김오즈",
    "홍길동",
  ];

  const filteredFriends = friends.filter((friend) =>
    friend.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4 w-full text-lighttext dark:text-darktext">
      {/* 검색창 */}
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

      {/* 친구 리스트 */}
      <div className="flex flex-col gap-3 flex-1 justify-center items-center min-h-[200px]">
        {filteredFriends.length > 0 ? (
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
