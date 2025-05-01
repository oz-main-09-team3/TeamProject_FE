import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends, FaBell, FaUser } from "react-icons/fa";
import { TestTube2Icon, SunIcon, MoonIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function NavigationBar({
  onFriendsClick,
  onNotificationsClick,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDark, setIsDark] = useState(
    () =>
      localStorage.getItem("theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const NavIcon = ({ to, label, children }) => {
    const isActive = location.pathname === to;
    return (
      <button
        onClick={() => navigate(to)}
        className="relative group"
        aria-label={label}
      >
        <div
          className={`transition-transform duration-200 hover:scale-110
            ${
              isActive
                ? "text-lightOrange dark:text-darkOrange"
                : "text-lighttext dark:text-darktext"
            }`}
        >
          {children}
        </div>
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
          {label}
        </div>
      </button>
    );
  };

  const handleFriendsClick = () => {
    const nextState = !isFriendsOpen;
    setIsFriendsOpen(nextState);
    setIsNotificationsOpen(false);
    onFriendsClick();
  };

  const handleNotificationsClick = () => {
    const nextState = !isNotificationsOpen;
    setIsNotificationsOpen(nextState);
    setIsFriendsOpen(false);
    onNotificationsClick();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-[72px] px-4 sm:px-6 md:px-10 
                flex justify-end items-center gap-3 sm:gap-4 md:gap-6 
                z-50 shadow-sm bg-lightBg dark:bg-darkBg transition-colors duration-300 overflow-x-auto"
    >
      {/* 배경 레이어 */}
      <div className="absolute inset-0 h-[72px] bg-lightYellow dark:bg-darkBg z-[-1]" />

      <NavIcon to="/main" label="캘린더">
        <FaCalendarAlt size={22} />
      </NavIcon>

      <button
        onClick={handleFriendsClick}
        className={`relative group hover:scale-110 transition
          ${isFriendsOpen ? "text-lightOrange dark:text-darkOrange" : "text-lighttext dark:text-darktext"}`}
        aria-label="친구 목록"
      >
        <FaUserFriends size={22} />
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
          친구 목록
        </div>
      </button>

      <button
        onClick={handleNotificationsClick}
        className={`relative group hover:scale-110 transition
          ${isNotificationsOpen ? "text-lightOrange dark:text-darkOrange" : "text-lighttext dark:text-darktext"}`}
        aria-label="알림"
      >
        <FaBell size={22} />
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
          알림
        </div>
      </button>

      <NavIcon to="/mypage" label="마이페이지">
        <FaUser size={22} />
      </NavIcon>

      {[2, 3, 4, 5].map((num) => (
        <NavIcon key={num} to={`/test${num}`} label={`테스트 ${num}`}>
          <TestTube2Icon size={22} />
        </NavIcon>
      ))}

      <button
        onClick={toggleTheme}
        className="text-lighttext dark:text-darktext hover:scale-110 transition"
        aria-label="모드 전환"
      >
        {isDark ? <SunIcon size={22} /> : <MoonIcon size={22} />}
      </button>
    </div>
  );
}
