import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends, FaBell, FaUser, FaPen } from "react-icons/fa";
import { SunIcon, MoonIcon, Menu, X } from "lucide-react";
import { useRef, useEffect } from "react";
import LogoD from "../assets/LogoD.png";
import LogoL from "../assets/LogoL.png";
import useUiStore from "../store/uiStore"; // Zustand 스토어 임포트

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const friendsButtonRef = useRef(null);
  const notificationsButtonRef = useRef(null);

  // Zustand 스토어에서 상태와 액션 가져오기
  const { 
    isDarkMode, 
    toggleDarkMode, 
    isFriendsOpen, 
    isNotificationsOpen, 
    isMobileMenuOpen,
    toggleFriends,
    toggleNotifications,
    toggleMobileMenu
  } = useUiStore();

  // 클릭 이벤트 핸들러
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 사이드바와 알림/친구 목록 영역을 클릭한 경우
      const sidebar = document.querySelector('.sidebar-container');
      const notificationsPanel = document.querySelector('.notifications-panel');
      const friendsPanel = document.querySelector('.friends-panel');
      const hamburgerButton = document.querySelector('.hamburger-button');
      
      // 햄버거 버튼 클릭은 무시
      if (hamburgerButton && hamburgerButton.contains(event.target)) {
        return;
      }
      
      if (
        (sidebar && sidebar.contains(event.target)) ||
        (notificationsPanel && notificationsPanel.contains(event.target)) ||
        (friendsPanel && friendsPanel.contains(event.target))
      ) {
        return;
      }

      // 모바일 메뉴 외부 클릭 시 닫기
      if (isMobileMenuOpen && sidebar && !sidebar.contains(event.target)) {
        toggleMobileMenu();
      }

      if (
        isFriendsOpen && 
        friendsButtonRef.current && 
        !friendsButtonRef.current.contains(event.target)
      ) {
        toggleFriends();
      }
      
      if (
        isNotificationsOpen && 
        notificationsButtonRef.current && 
        !notificationsButtonRef.current.contains(event.target)
      ) {
        toggleNotifications();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFriendsOpen, isNotificationsOpen, isMobileMenuOpen, toggleFriends, toggleNotifications, toggleMobileMenu]);

  const NavIcon = ({ to, label, children, onClick, ref, isActive }) => {
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
            if (isMobileMenuOpen) {
              toggleMobileMenu();
            }
          }
        }}
        className={`relative flex items-center w-full md:w-auto p-1 md:p-0 group
          ${active ? "nav-icon-active font-semibold" : "nav-icon font-medium"}`}
        aria-label={label}
      >
        <div className="transition-transform duration-100 relative">
          {children}
          <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-0.5 whitespace-nowrap bg-lightGold dark:bg-darkBrown text-lighttext dark:text-darktext text-[10px] leading-none rounded-sm px-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[9999] font-semibold">
            {label}
          </div>
        </div>
        <span className={`md:hidden ${active ? "text-lightOrange dark:text-darkOrange font-semibold" : "text-lighttext dark:text-darktext font-medium"}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      className="fixed top-0 left-0 w-full md:h-[72px] h-auto px-4 sm:px-6 md:px-10 
                flex items-center justify-between
                z-50 md:shadow-sm md:bg-lightBg md:dark:bg-darkBg bg-lightYellow dark:bg-darkBg transition-colors duration-100"
    >
      <div className="hidden md:block absolute inset-0 h-[72px] bg-lightYellow dark:bg-darkBg z-[-1]" />
      
      <div 
        className="cursor-pointer flex items-center" 
        onClick={() => {
          navigate('/main');
          if (isMobileMenuOpen) toggleMobileMenu();
        }}
      >
        <img 
          src={isDarkMode ? LogoD : LogoL} 
          alt="Logo" 
          className="h-10 w-auto"
        />
      </div>

      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-lighttext dark:text-darktext py-4 hamburger-button"
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
          <NavIcon label="친구 목록" onClick={() => {
            toggleFriends();
            if (isMobileMenuOpen) toggleMobileMenu();
          }} isActive={isFriendsOpen}>
            <FaUserFriends size={22} />
          </NavIcon>
        </div>
        <div ref={notificationsButtonRef}>
          <NavIcon label="알림" onClick={() => {
            toggleNotifications();
            if (isMobileMenuOpen) toggleMobileMenu();
          }} isActive={isNotificationsOpen}>
            <FaBell size={22} />
          </NavIcon>
        </div>
        <NavIcon to="/mypage" label="마이페이지" isActive={!isFriendsOpen && !isNotificationsOpen && location.pathname === '/mypage'}>
          <FaUser size={22} />
        </NavIcon>
        <button
          onClick={() => {
            toggleDarkMode();
            if (isMobileMenuOpen) toggleMobileMenu();
          }}
          className="flex items-center gap-3 p-2 md:p-0 text-lighttext dark:text-darktext hover:scale-105 md:hover:scale-105 transition w-full md:w-auto"
          aria-label="모드 전환"
        >
          {isDarkMode ? <SunIcon size={22} /> : <MoonIcon size={22} />}
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
          <NavIcon label="친구 목록" onClick={() => {
            toggleFriends();
            if (isMobileMenuOpen) toggleMobileMenu();
          }} isActive={isFriendsOpen}>
            <FaUserFriends size={22} />
          </NavIcon>
        </div>
        <div ref={notificationsButtonRef}>
          <NavIcon label="알림" onClick={() => {
            toggleNotifications();
            if (isMobileMenuOpen) toggleMobileMenu();
          }} isActive={isNotificationsOpen}>
            <FaBell size={22} />
          </NavIcon>
        </div>
        <NavIcon to="/mypage" label="마이페이지" isActive={!isFriendsOpen && !isNotificationsOpen && location.pathname === '/mypage'}>
          <FaUser size={22} />
        </NavIcon>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 text-lighttext dark:text-darktext hover:text-lightOrange dark:hover:text-darkOrange transition-colors p-2 rounded"
          aria-label="모드 전환"
        >
          {isDarkMode ? <SunIcon size={22} /> : <MoonIcon size={22} />}
        </button>
      </div>
    </div>
  );
}