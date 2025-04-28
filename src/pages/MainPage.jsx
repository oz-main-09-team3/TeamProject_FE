import { useState } from "react";
import RowCard from "../components/RowCard";
import NavigationBar from "../components/NavigationBar";
import FriendList from "../components/FriendRowCard";

function MainPage() {
  const [showFriends, setShowFriends] = useState(false);

  const diaryList = [
    { id: 1, header: "아 오늘도 힘들었다.", body: "아 진짜 집 가고싶었다." },
    { id: 2, header: "코드 너무 안 돌아간다.", body: "나도 모르게 감자처럼 웅크렸다." },
    { id: 3, header: "조금은 나아진 것 같다.", body: "어제보단 성장했어!" },
    { id: 4, header: "프론트 너무 재밌다.", body: "역시 나랑 잘 맞아!" },
    { id: 5, header: "하..버그잡기 힘들어.", body: "하지만 해냈다!" },
  ];

  return (
    <div className="relative min-h-screen bg-pink-100 p-10">

      {/* Navigation Bar */}
      <NavigationBar onFriendsClick={() => setShowFriends(!showFriends)} />

      {/* Main Content */}
      <div className="flex gap-8">
        {/* 캘린더 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 max-w-md">
          <h2 className="text-2xl font-bold mb-6">JULY 2020</h2>
          <div className="border p-8 rounded-lg flex items-center justify-center text-gray-500">
            캘린더 자리
          </div>
        </div>

        {/* 일기 리스트 */}
        <div className="flex flex-col gap-4 flex-1">
          {diaryList.map((diary) => (
            <div key={diary.id} className="bg-white rounded-lg shadow-md p-4">
              <RowCard
                emojiSrc="/vite.svg"
                headerText={diary.header}
                bodyText={diary.body}
                rightIcon={<span className="text-2xl">🤍</span>}
                onClick={() => alert(`${diary.header} 클릭!`)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 친구 목록 사이드바 */}
      {showFriends && (
        <div className="fixed top-16 right-0 w-80 h-full bg-white shadow-lg overflow-y-auto p-4">
          <FriendList />
        </div>
      )}
    </div>
  );
}

export default MainPage;
