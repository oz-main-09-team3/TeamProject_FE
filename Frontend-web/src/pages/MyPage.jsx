import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RowCard from "../components/RowCard";
import ProfileImage from "../components/ProfileImage";
import Modal from "../components/Modal";
import MENU_ITEMS from "../constants/menuItems.jsx";
import { Helmet } from 'react-helmet-async';

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
    <>
      <Helmet>
        <title>마이페이지 - 멋쟁이 감자</title>
        <meta name="description" content="내 정보와 활동을 확인하세요." />
        <meta property="og:title" content="마이페이지 - 멋쟁이 감자" />
        <meta property="og:description" content="내 정보와 활동을 확인하세요." />
      </Helmet>
      <main className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-darkdark pt-[100px]">
        <div className="w-full max-w-md relative pt-[92px] pb-8 flex flex-col items-center bg-white dark:bg-darktext rounded-3xl shadow-lg">
          <ProfileImage />

          {/* 리스트 */}
          <div className="w-full px-6 space-y-4 mt-6">
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
    </>
  );
}
