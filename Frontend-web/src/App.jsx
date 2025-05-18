import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from "react";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import NotificationsPage from "./pages/NotificationsPage";
import NavigationBar from "./components/NavigationBar";
import FriendList from "./pages/FriendsList";
import FriendInviteSystem from "./pages/Qrcodepage";
import ChartPage from "./pages/Chart";
import LoginPage from "./pages/Login";
import UserInfo from "./pages/UserInfo";
import DiaryEditor from "./pages/DiaryEditor";
import EditUserInfo from "./pages/EditUserInfo";
import OAuthCallback from "./pages/OAuthCallback";
import ListWrapper from "./components/ListWrapper";
import FriendDiaryView from "./pages/FriendDiaryView";
import DiaryEditPage from "./pages/DiaryEditPage";
import DiaryDetailPage from "./pages/DiaryDetailPage";
import FriendCalendarPage from "./pages/FriendCalendarPage";
import Layout from './components/Layout';
import { HelmetProvider, Helmet } from 'react-helmet-async';

function AppLayoutWithNavbar() {
  const [showFriends, setShowFriends] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <div className="relative min-h-screen">
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
        <Route path="/mypage/edit/" element={<EditUserInfo />} />
        <Route path="/mypage/chart" element={<ChartPage />} />
        <Route path="/mypage/qrcode" element={<FriendInviteSystem />} />
        <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
        <Route path="/diary" element={<DiaryDetailPage />} />
        <Route path="/diary/edit/:id" element={<DiaryEditPage />} />
        <Route path="/diary/new" element={<DiaryEditor />} />
        <Route path="/friend-diary" element={<FriendDiaryView />} />
        <Route path="/friend-calendar/:friendId" element={<FriendCalendarPage />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>

      {/* 사이드바 */}
      {showFriends && (
        <ListWrapper>
          <h2 className="text-2xl font-bold mb-6">친구 목록</h2>
          <FriendList onFriendClick={() => setShowFriends(false)} />
        </ListWrapper>
      )}

      {showNotifications && (
        <ListWrapper>
          <h2 className="text-2xl font-bold mb-6">알림</h2>
          <NotificationsPage />
        </ListWrapper>
      )}
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/*" element={
            <Layout>
              <AppLayoutWithNavbar />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;