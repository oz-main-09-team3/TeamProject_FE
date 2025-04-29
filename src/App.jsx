import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import NotificationsPage from "./pages/NotificationsPage";
import NavigationBar from "./components/NavigationBar"; // ✅ 네비게이션바
import FriendList from "./pages/FriendsList"; // ✅ 친구 목록
import FriendInviteSystem from "./pages/Qrcodepage";
import ChartPage from "./pages/Chart";
import LoadingPage from "./pages/Loadingpage";
import UserInfo from "./pages/UserInfo";
import DiaryEditor from "./pages/DiaryEditor";
import EditUserInfo from "./pages/EditUserInfo";

export default function App() {
  const [showFriends, setShowFriends] = useState(false);

  return (
    <Router>
      <div className="relative min-h-screen bg-pink-100">
        <NavigationBar onFriendsClick={() => setShowFriends((prev) => !prev)} />
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/info" element={<UserInfo />} />
          <Route path="/mypage/edit" element={<EditUserInfo />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          {import.meta.env.DEV ? (
            <Route path="test" element={<FriendInviteSystem />} />
          ) : null}
          {import.meta.env.DEV ? (
            <Route path="test1" element={<ChartPage />} />
          ) : null}
          {import.meta.env.DEV ? (
            <Route path="test2" element={<LoadingPage />} />
          ) : null}
{import.meta.env.DEV ? (
            <Route path="test3" element={<DiaryEditor />} />
          ) : null}
          {/* 필요한 페이지 더 추가 */}
        </Routes>

        {/* ✅ 뿅! 뜨는 친구목록 */}
        {showFriends && (
          <div className="fixed top-20 right-0 w-80 h-[calc(100%-5rem)] bg-white shadow-lg rounded-l-2xl p-6 overflow-y-auto z-50 transition-all">
            <h2 className="text-2xl font-bold mb-6">친구 목록</h2>
            <FriendList />
          </div>
        )}
      </div>
    </Router>
  );
}
