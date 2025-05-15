import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RowCard from "../components/RowCard";
import Modal from "../components/Modal";
import MENU_ITEMS_ORIGIN from "../constants/menuItems.jsx";
import { FiUserX, FiLogOut } from "react-icons/fi";

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
      <div className="w-full max-w-md relative pt-[100px] pb-8 flex flex-col gap-2 items-center bg-yl100 dark:bg-darktext rounded-3xl shadow-lg">
        {/* 프로필 이미지: 카드 내부 상단 중앙 */}
        <div className="absolute -top-[92px]">
          <div className="w-[184px] h-[184px] rounded-full overflow-hidden shadow-md">
            <img
              src="/profile.png"
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* 카드 리스트: flex-1, flex-col, justify-end로 하단 정렬 */}
        <div className="w-full mt-2 px-6 flex flex-col gap-2">
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
          <RowCard
            emojiSrc="/profile.png"
            headerText="로그아웃"
            bodyText="계정에서 로그아웃합니다"
            rightIcon={<FiLogOut size={22} />}
            onClick={handleLogout}
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
