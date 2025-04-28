import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import MainPage from './pages/MainPage';
import FriendsPage from './pages/FriendsPage';
import NotificationsPage from './pages/NotificationsPage';
import MyPage from './pages/MyPage';
import FriendInviteSystem from './pages/Qrcodepage';
import ChartPage from './pages/Chart';





export default function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/mypage" element={<MyPage />} />
        {import.meta.env.DEV ? <Route path="test" element={<FriendInviteSystem />} /> : null}
        {import.meta.env.DEV ? <Route path="test1" element={<ChartPage />} /> : null}
      </Routes>
    </Router>
  );
}
