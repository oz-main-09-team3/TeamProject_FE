import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends, FaBell, FaUser, FaPen } from "react-icons/fa";
import { TestTube2Icon, SunIcon, MoonIcon, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import LogoD from "../assets/LogoD.png";
import LogoL from "../assets/LogoL.png";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const friendsButtonRef = useRef(null);
  const notificationsButtonRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 사이드바와 알림/친구 목록 영역을 클릭한 경우
      const sidebar = document.querySelector('.sidebar-container');
      const notificationsPanel = document.querySelector('.notifications-panel');
      const friendsPanel = document.querySelector('.friends-panel');
      
      if (
        (sidebar && sidebar.contains(event.target)) ||
        (notificationsPanel && notificationsPanel.contains(event.target)) ||
        (friendsPanel && friendsPanel.contains(event.target))
      ) {
        return;
      }

      if (
        isFriendsOpen && 
        friendsButtonRef.current && 
        !friendsButtonRef.current.contains(event.target)
      ) {
        setIsFriendsOpen(false);
        onFriendsClick(); 
      }
      
      if (
        isNotificationsOpen && 
        notificationsButtonRef.current && 
        !notificationsButtonRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
        onNotificationsClick(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFriendsOpen, isNotificationsOpen, onFriendsClick, onNotificationsClick]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const NavIcon = ({ to, label, children, onClick, ref, isActive }) => {
    const location = useLocation();
    const active = typeof isActive === 'boolean' ? isActive : (to && location.pathname === to);
    return (
      <button
        ref={ref}
        onClick={() => {
          if (onClick) {
            onClick();
          } else if (to) {
            if (location.pathname !== to) {
              navigate(to);
            }
            setIsMobileMenuOpen(false);
          }
        }}
        className={`relative group flex items-center gap-3 w-full md:w-auto p-2 md:p-0
          ${active ? "text-lightOrange dark:text-darkOrange" : "text-lighttext dark:text-darktext"}`}
        aria-label={label}
      >
        <div className="transition-transform duration-200 md:hover:scale-110">
          {children}
        </div>
        <span className="md:hidden text-lighttext dark:text-darktext">{label}</span>
        <div className="hidden md:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
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
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleNotificationsClick = () => {
    const nextState = !isNotificationsOpen;
    setIsNotificationsOpen(nextState);
    setIsFriendsOpen(false);
    onNotificationsClick();
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full md:h-[72px] h-auto px-4 sm:px-6 md:px-10 
                flex items-center justify-between
                z-50 md:shadow-sm md:bg-lightBg md:dark:bg-darkBg bg-lightYellow dark:bg-darkBg transition-colors duration-300"
    >
      <div className="hidden md:block absolute inset-0 h-[72px] bg-lightYellow dark:bg-darkBg z-[-1]" />
      
      <div 
        className="cursor-pointer flex items-center" 
        onClick={() => {
          navigate('/main');
          setIsMobileMenuOpen(false);
        }}
      >
        <img 
          src={isDark ? LogoD : LogoL} 
          alt="Logo" 
          className="h-10 w-auto"
        />
      </div>

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden text-lighttext dark:text-darktext py-4"
        aria-label="메뉴 열기/닫기"
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        className={`sidebar-container ${
          isMobileMenuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row fixed md:relative top-[64px] md:top-0 left-0 md:left-auto
        w-full md:w-auto bg-lightBg/95 dark:bg-darkdark/95 md:bg-transparent
        shadow-lg md:shadow-none p-4 md:p-0 gap-3 md:gap-4 lg:gap-6
        transition-all duration-300 ease-in-out transform
        ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
        border-t md:border-0 border-gray-200 dark:border-gray-700`}
      >
        <NavIcon to="/diary/new" label="일기 작성" isActive={!isFriendsOpen && !isNotificationsOpen && location.pathname === '/diary/new'}>
          <FaPen size={22} />
        </NavIcon>
        <NavIcon to="/main" label="캘린더" isActive={!isFriendsOpen && !isNotificationsOpen && location.pathname === '/main'}>
          <FaCalendarAlt size={22} />
        </NavIcon>
        <div ref={friendsButtonRef}>
          <NavIcon label="친구 목록" onClick={handleFriendsClick} isActive={isFriendsOpen}>
            <FaUserFriends size={22} />
          </NavIcon>
        </div>
        <div ref={notificationsButtonRef}>
          <NavIcon label="알림" onClick={handleNotificationsClick} isActive={isNotificationsOpen}>
            <FaBell size={22} />
          </NavIcon>
        </div>
        <NavIcon to="/mypage" label="마이페이지" isActive={!isFriendsOpen && !isNotificationsOpen && location.pathname === '/mypage'}>
          <FaUser size={22} />
        </NavIcon>
        <button
          onClick={() => {
            toggleTheme();
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 p-2 md:p-0 text-lighttext dark:text-darktext md:hover:scale-110 transition w-full md:w-auto"
          aria-label="모드 전환"
        >
          {isDark ? <SunIcon size={22} /> : <MoonIcon size={22} />}
          <span className="md:hidden">모드 전환</span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-4 ml-auto">
        <NavIcon to="/diary/new" label="일기 작성" isActive={!isFriendsOpen && !isNotificationsOpen && location.pathname === '/diary/new'}>
          <FaPen size={22} />
        </NavIcon>
        <NavIcon to="/main" label="캘린더" isActive={!isFriendsOpen && !isNotificationsOpen && location.pathname === '/main'}>
          <FaCalendarAlt size={22} />
        </NavIcon>
        <div ref={friendsButtonRef}>
          <NavIcon label="친구 목록" onClick={handleFriendsClick} isActive={isFriendsOpen}>
            <FaUserFriends size={22} />
          </NavIcon>
        </div>
        <div ref={notificationsButtonRef}>
          <NavIcon label="알림" onClick={handleNotificationsClick} isActive={isNotificationsOpen}>
            <FaBell size={22} />
          </NavIcon>
        </div>
        <NavIcon to="/mypage" label="마이페이지" isActive={!isFriendsOpen && !isNotificationsOpen && location.pathname === '/mypage'}>
          <FaUser size={22} />
        </NavIcon>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-lighttext dark:text-darktext hover:text-lightOrange dark:hover:text-darkOrange transition-colors p-2 rounded"
          aria-label="모드 전환"
        >
          {isDark ? <SunIcon size={22} /> : <MoonIcon size={22} />}
        </button>
      </div>
    </div>
  );
}