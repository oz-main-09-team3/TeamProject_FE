import { X } from "lucide-react";
import useUiStore from "../store/uiStore";

export default function ListWrapper({ children, onClick }) {
  const { toggleFriends, toggleNotifications } = useUiStore();

  const handleClose = () => {
    if (onClick) onClick();
    // 현재 열려있는 패널에 따라 적절한 토글 함수 호출
    if (window.location.pathname.includes('friend')) {
      toggleFriends();
    } else {
      toggleNotifications();
    }
  };

  return (
    <div
      onClick={onClick}
      className="fixed top-[72px] right-0 h-[calc(100%-72px)] w-[30%] min-w-[360px] max-w-sm
                 bg-yl100 dark:bg-darktext dark:text-darkBg text-lighttext 
                 shadow-2xl rounded-l-2xl p-6 overflow-y-auto z-50
                 transition-all
                 md:w-[360px] 
                 sm:top-[72px] sm:right-0 sm:w-full sm:h-[calc(100%-72px)] sm:rounded-none sm:p-4"
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-lightGold/20 dark:hover:bg-darkBrown/20 transition-colors"
        aria-label="닫기"
      >
        <X className="w-5 h-5 text-lighttext dark:text-darkBg" />
      </button>
      {children}
    </div>
  );
}