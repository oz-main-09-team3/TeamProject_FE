import React from "react";
import { FiLogOut } from "react-icons/fi";
import { logoutAll } from "../utils/auth";

export default function LogoutCard({ onAfterLogout, className = "", imgClassName = "", textClassName = "", iconClassName = "" }) {
  const handleLogout = () => {
    logoutAll();
    if (onAfterLogout) onAfterLogout();
  };
  return (
    <div
      className={`flex items-center justify-between w-full min-h-[64px] cursor-pointer transition-all duration-200 ${className}`}
      onClick={handleLogout}
    >
      <div className="flex items-center gap-3">
        <img src="/profile.png" alt="프로필" className={`rounded-full object-cover ${imgClassName}`} />
        <div className={`flex flex-col justify-center ${textClassName}`}>
          <span className="font-semibold text-base text-lighttext dark:text-darktext">로그아웃</span>
          <span className="text-xs text-gray-500 dark:text-darktext">계정에서 로그아웃합니다.</span>
        </div>
      </div>
      <FiLogOut size={22} className="text-lighttext dark:text-darktext" />
    </div>
  );
} 