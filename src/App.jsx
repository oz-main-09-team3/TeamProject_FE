import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import MainPage from "./pages/MainPage";
import FriendsPage from "./pages/FriendsPage";
import NotificationsPage from "./pages/NotificationsPage";
import MyPage from "./pages/MyPage";

export default function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}
