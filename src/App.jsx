import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import MainPage from "./pages/MainPage";
import FriendsPage from "./pages/FriendsPage";
import NotificationsPage from "./pages/NotificationsPage";
import MyPage from "./pages/MyPage";
import FriendInviteSystem from "./pages/Qrcodepage";

export default function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        {/* ✅ 루트 경로 처리 */}
        <Route path="/" element={<Navigate to="/main" replace />} />

        <Route path="/main" element={<MainPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/mypage" element={<MyPage />} />
        {import.meta.env.DEV ? (
          <Route path="/test" element={<FriendInviteSystem />} />
        ) : null}
      </Routes>
    </Router>
  );
}
