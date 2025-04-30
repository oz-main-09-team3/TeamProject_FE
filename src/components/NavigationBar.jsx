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
          className={`transition-transform duration-200 hover:scale-110 ${
            isActive
              ? "text-blue-500 dark:text-amber-400"
              : "text-brown900 dark:text-white"
          }`}
        >
          {children}
        </div>
        {/* 툴팁 */}
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
          {label}
        </div>
      </button>
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[72px] px-6 md:px-10 flex justify-end items-center gap-6 z-50 shadow-sm bg-lightBg dark:bg-darkBg transition-colors duration-300">
      <NavIcon to="/main" label="캘린더">
        <FaCalendarAlt size={22} />
      </NavIcon>

      <button
        onClick={onFriendsClick}
        className="relative group text-brown900 dark:text-white hover:scale-110 transition"
        aria-label="친구 목록"
      >
        <FaUserFriends size={22} />
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
          친구 목록
        </div>
      </button>

      <button
        onClick={onNotificationsClick}
        className="relative group text-brown900 dark:text-white hover:scale-110 transition"
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

      {/* 🌗 다크/라이트 토글 버튼 */}
      <button
        onClick={toggleTheme}
        className="text-brown900 dark:text-white hover:scale-110 transition"
        aria-label="모드 전환"
      >
        {isDark ? <SunIcon size={22} /> : <MoonIcon size={22} />}
      </button>
    </div>
  );
}
