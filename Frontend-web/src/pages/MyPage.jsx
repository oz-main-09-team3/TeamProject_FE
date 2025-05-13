import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RowCard from "../components/RowCard";
import ProfileImage from "../components/ProfileImage";
import Modal from "../components/Modal";
import MENU_ITEMS from "../constants/menuItems.jsx";

export default function MyPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    console.log("탈퇴 확인 로직 실행");
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

  return (
     <main className="flex items-center justify-center min-h-screen px-4 bg-lightBg dark:bg-darkdark">
      <div className="relative w-full max-w-md flex flex-col items-center">
        {/* 프로필 이미지: absolute로 박스 위에 겹치게 */}
        <div className="absolute left-0 right-0 mx-auto -top-[92px] z-10 flex justify-center">
          <ProfileImage />
        </div>
        {/* 컨테이너 박스: pt로 이미지 겹칠 공간 확보, flex-1로 남는 공간 채움 */}
        <div className="w-full flex flex-col items-center bg-white dark:bg-darktext rounded-3xl shadow-lg pt-[92px] pb-8 min-h-[600px] max-h-[800px]">
          {/* 카드 리스트: flex-1, flex-col, justify-end로 하단 정렬 */}
          <div className="w-full h-full flex-1 flex flex-col justify-end px-6 space-y-2">
            {MENU_ITEMS.map((item) => (
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
