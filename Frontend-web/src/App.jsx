import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from "react";
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
import Modal from './components/Modal';
import { HelmetProvider } from 'react-helmet-async';
import useUiStore from './store/uiStore';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';

function AppLayoutWithNavbar() {
  // Zustand 스토어 사용
  const { 
    isFriendsOpen, 
    isNotificationsOpen,
  } = useUiStore();
  
  return (
    <div className="relative min-h-screen">
      <NavigationBar />

      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/info" element={<UserInfo />} />
        <Route path="/mypage/edit/" element={<EditUserInfo />} />
        <Route path="/mypage/chart" element={<ChartPage />} />
        <Route path="/mypage/qrcode" element={<FriendInviteSystem />} />
        <Route path="/diary" element={<DiaryDetailPage />} />
        <Route path="/diary/edit/:id" element={<DiaryEditPage />} />
        <Route path="/diary/new" element={<DiaryEditor />} />
        <Route path="/friend-diary" element={<FriendDiaryView />} />
        <Route path="/friend-calendar/:friendId" element={<FriendCalendarPage />} />
        <Route path="/friend-diary/:diaryId" element={<FriendDiaryView />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>

      {/* 사이드바 */}
      {isFriendsOpen && (
        <ListWrapper>
          <h2 className="text-2xl font-bold mb-6">친구 목록</h2>
          <FriendList/>
        </ListWrapper>
      )}

      {isNotificationsOpen && (
        <ListWrapper>
          <h2 className="text-2xl font-bold mb-6">알림</h2>
          <NotificationsPage />
        </ListWrapper>
      )}
      
      {/* 모달 컴포넌트들 */}
      <Modal type="confirm" />
      <Modal type="success" />
      <Modal type="error" />
      <Modal type="warning" />
      <Modal type="info" />
    </div>
  );
}

function App() {
  // Zustand 스토어 사용
  const { isDarkMode } = useUiStore();
  const { isAuthenticated, fetchUserInfo } = useAuthStore();
  
  // 앱 시작 시 사용자 인증 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    }
  }, [fetchUserInfo]);
  
  // 다크 모드 적용
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);
  
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* 공개 경로 */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
          
          {/* 보호된 경로 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={
              <Layout>
                <AppLayoutWithNavbar />
              </Layout>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;