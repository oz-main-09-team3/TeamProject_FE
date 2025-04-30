import RowCard from "../components/RowCard";
import { ArrowRight, Search } from "lucide-react";
import testimage from "../assets/profile.png";

export default function FriendList() {
  const friends = [
    "김오즈",
    "홍길동",
    "엄세욱",
    "김은지",
    "정봉석",
    "김오즈",
    "홍길동",
  ];

  return (
    <div className="flex flex-col gap-4 w-full text-lighttext">
      {/* 검색창 */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-lightBg dark:bg-darkBrown rounded">
        <Search size={20} className="text-lighttext dark:text-darktext" />
        <input
          type="text"
          placeholder="검색"
          className="bg-transparent outline-none flex-1 text-lighttext dark:text-darktext placeholder-lighttext dark:placeholder-darktext"
        />
      </div>

      {/* 친구 리스트 */}
      <div className="flex flex-col gap-3">
        {friends.map((friend, index) => (
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
        ))}
      </div>
    </div>
  );
}
