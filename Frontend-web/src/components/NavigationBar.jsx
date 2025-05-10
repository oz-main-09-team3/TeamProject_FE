import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends, FaBell, FaUser } from "react-icons/fa";
import { SunIcon, MoonIcon, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import LogoD from "../assets/LogoD.png";
import LogoL from "../assets/LogoL.png";

function NavIcon({ to, label, icon, onClick, isActive, buttonRef, onMenuItemClick }) {
  const navigate = useNavigate();
  return (
    <button
      ref={buttonRef}
      onClick={() => {
        if (onClick) {
          onClick();
        } else if (to) {
          navigate(to);
        }
        if (onMenuItemClick) onMenuItemClick();
      }}
      className="relative group flex items-center gap-3 w-full md:w-auto p-2 md:p-0"
      aria-label={label}
    >
      <div
        className={`transition-transform duration-200 md:hover:scale-110
          ${isActive ? "text-lightOrange dark:text-darkOrange" : "text-lighttext dark:text-darktext"}`}
      >
        {icon}
      </div>
      <span className="md:hidden text-lighttext dark:text-darktext">{label}</span>
      <div className="hidden md:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        {label}
      </div>
    </button>
  );
}

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

  // 메뉴 배열화
  const menuItems = [
    {
      key: 'calendar',
      to: '/main',
      label: '캘린더',
      icon: <FaCalendarAlt size={22} />,
    },
    {
      key: 'friends',
      label: '친구 목록',
      icon: <FaUserFriends size={22} />, // onClick 별도
      ref: friendsButtonRef,
      onClick: () => {
        const nextState = !isFriendsOpen;
        setIsFriendsOpen(nextState);
        setIsNotificationsOpen(false);
        onFriendsClick();
        setIsMobileMenuOpen(false);
      },
    },
    {
      key: 'notifications',
      label: '알림',
      icon: <FaBell size={22} />, // onClick 별도
      ref: notificationsButtonRef,
      onClick: () => {
        const nextState = !isNotificationsOpen;
        setIsNotificationsOpen(nextState);
        setIsFriendsOpen(false);
        onNotificationsClick();
        setIsMobileMenuOpen(false);
      },
    },
    {
      key: 'mypage',
      to: '/mypage',
      label: '마이페이지',
      icon: <FaUser size={22} />,
    },
  ];

  return (
    <div
      className="fixed top-0 left-0 w-full h-[72px] px-4 sm:px-6 md:px-10 
                flex items-center justify-between
                z-50 shadow-sm bg-lightYellow dark:bg-darkBg transition-colors duration-300"
    >
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
        className="md:hidden text-lighttext dark:text-darktext p-4"
        aria-label="메뉴 열기/닫기"
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row fixed md:relative top-[64px] md:top-0 left-0 md:left-auto
        w-full md:w-auto bg-lightBg dark:bg-darkBg md:bg-transparent
        shadow-lg md:shadow-none p-4 md:p-0 gap-3 md:gap-4 lg:gap-6
        transition-all duration-300 border-t md:border-0 border-gray-200 dark:border-gray-700`}
      >
        {menuItems.map((item) => (
          <NavIcon
            key={item.key}
            to={item.to}
            label={item.label}
            icon={item.icon}
            onClick={item.onClick}
            isActive={item.to ? location.pathname === item.to : false}
            buttonRef={item.ref}
            onMenuItemClick={isMobileMenuOpen ? () => setIsMobileMenuOpen(false) : undefined}
          />
        ))}

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
    </div>
  );
}