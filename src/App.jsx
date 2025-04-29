import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import NotificationsPage from "./pages/NotificationsPage";
import NavigationBar from "./components/NavigationBar";
import FriendList from "./pages/FriendsList";
import FriendInviteSystem from "./pages/Qrcodepage";
import ChartPage from "./pages/Chart";
import LoadingPage from "./pages/Loadingpage";
import UserInfo from "./pages/UserInfo";
import DiaryEditor from "./pages/DiaryEditor";
import EditUserInfo from "./pages/EditUserInfo";
import OAuthCallback from "./pages/OAuthCallback";
import ListWrapper from "./components/ListWrapper";

export default function App() {
  const [showFriends, setShowFriends] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <Router>
      <div className="relative min-h-screen bg-pink-100">
        <NavigationBar
          onFriendsClick={() => {
            setShowFriends((prev) => !prev);
            setShowNotifications(false);
          }}
          onNotificationsClick={() => {
            setShowNotifications((prev) => !prev);
            setShowFriends(false);
          }}
        />

        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/info" element={<UserInfo />} />
          <Route path="/mypage/edit" element={<EditUserInfo />} />
          <Route path="/mypage/chart" element={<ChartPage />} />
          <Route path="/mypage/qrcode" element={<FriendInviteSystem />} />
          <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
          {import.meta.env.DEV ? (
            <Route path="test2" element={<LoadingPage />} />
          ) : null}
          {import.meta.env.DEV ? (
            <Route path="test3" element={<DiaryEditor />} />
          ) : null}
        </Routes>

        {/* 사이드바 */}
        {showFriends && (
          <ListWrapper>
            <h2 className="text-2xl font-bold mb-6">친구 목록</h2>
            <FriendList />
          </ListWrapper>
        )}

        {showNotifications && (
          <ListWrapper>
            <h2 className="text-2xl font-bold mb-6">알림</h2>
            <NotificationsPage />
          </ListWrapper>
        )}
      </div>
    </Router>
  );
}
