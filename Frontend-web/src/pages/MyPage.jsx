import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RowCard from "../components/RowCard";
import Modal from "../components/Modal";
import MENU_ITEMS_ORIGIN from "../constants/menuItems.jsx";
import { FiUserX } from "react-icons/fi";
import LogoutCard from "../components/LogoutCard";

// 회원 탈퇴 아이템을 찾아서 아이콘 교체
const MENU_ITEMS = MENU_ITEMS_ORIGIN.map(item =>
  item.id === 'withdraw'
    ? { ...item, rightIcon: <FiUserX size={22} color="red" /> }
    : item
);

export default function MyPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleMenuClick = (item) => {
    if (item.id === 'withdraw') {
      setIsModalOpen(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
     <main className="flex items-center justify-center min-h-screen px-4 bg-lightBg dark:bg-darkdark">
      <div className="relative w-full max-w-md flex flex-col items-center">
        <div className="w-full flex flex-col items-center bg-white dark:bg-darktext rounded-3xl shadow-lg pt-10 pb-8 min-h-[600px] max-h-[800px]">
          {/* 프로필 이미지: 카드 내부 상단 중앙 */}
          <div className="flex justify-center mb-6">
            <img
              src="/profile.png"
              alt="프로필 이미지"
              className="rounded-full object-cover shadow-md"
              style={{ width: "184px", height: "186px" }}
            />
          </div>
          {/* 카드 리스트: flex-1, flex-col, justify-end로 하단 정렬 */}
          <div className="w-full h-full flex-1 flex flex-col justify-end px-6 space-y-2">
            {MENU_ITEMS.filter(item => item.id !== 'withdraw').map((item) => (
              <RowCard
                key={item.id}
                emojiSrc="/profile.png"
                headerText={item.headerText}
                bodyText={item.bodyText}
                rightIcon={item.rightIcon}
                onClick={() => handleMenuClick(item)}
              />
            ))}
            {/* 로그아웃 카드 */}
            <LogoutCard
              onAfterLogout={() => navigate('/')}
              className="flex items-center justify-between w-full p-4 sm:p-5 rounded-2xl shadow-md cursor-pointer transition bg-lightBg hover:bg-lightYellow dark:bg-darkdark dark:hover:bg-darkBrown flex-shrink-0"
              imgClassName="w-10 h-10 sm:w-12 sm:h-12"
              textClassName="text-lighttext dark:text-darktext"
              iconClassName="text-lighttext dark:text-darktext"
            />
            {/* 회원 탈퇴 카드 */}
            {MENU_ITEMS.filter(item => item.id === 'withdraw').map((item) => (
              <RowCard
                key={item.id}
                emojiSrc="/profile.png"
                headerText={item.headerText}
                bodyText={item.bodyText}
                rightIcon={item.rightIcon}
                onClick={() => handleMenuClick(item)}
              />
            ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        type="error"
        title="회원 탈퇴"
        content="정말 탈퇴하시겠습니까? 탈퇴하면 모든 데이터가 삭제됩니다!"
        confirmText="탈퇴하기"
        cancelText="취소"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </main>
  );
}
