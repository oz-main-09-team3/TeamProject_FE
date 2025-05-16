import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RowCard from "../components/RowCard";
import Modal from "../components/Modal";
import MENU_ITEMS_ORIGIN from "../constants/menuItems.jsx";
import { FiUserX, FiLogOut } from "react-icons/fi";
import { deleteAccount, getMyInfo } from "../service/userApi";
import { logout } from "../service/authApi"; // 소셜 로그아웃 API 가져오기

// 회원 탈퇴 아이템을 찾아서 아이콘 교체
const MENU_ITEMS = MENU_ITEMS_ORIGIN.map(item =>
  item.id === 'withdraw'
    ? { ...item, rightIcon: <FiUserX size={22} color="red" /> }
    : item
);

export default function MyPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getMyInfo();
        if (response?.data) {
          setUserInfo(response.data);
        }
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
      }
    };

    fetchUserInfo();
  }, []);

  // 회원 탈퇴 처리
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 회원 탈퇴 API 호출
      await deleteAccount();
      
      // 로컬 스토리지에서 토큰 삭제
      localStorage.removeItem('token');
      
      // 모달 닫기
      setIsModalOpen(false);
      
      // 탈퇴 성공 메시지 표시 (선택적)
      alert("회원 탈퇴가 완료되었습니다.");
      
      // 로그인 페이지로 이동
      navigate('/login');
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
      setError(err.response?.data?.message || "회원 탈퇴 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
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

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      await logout();
      // 로컬 스토리지에서 토큰 삭제
      localStorage.removeItem('token');
      // 로그인 페이지로 이동
      navigate('/');
    } catch (err) {
      console.error("로그아웃 실패:", err);
      // API 호출이 실패하더라도 토큰은 삭제하고 로그인 페이지로 이동
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 bg-lightBg dark:bg-darkdark">
      <div className="w-full max-w-md relative pt-[100px] pb-8 flex flex-col gap-2 items-center bg-yl100 dark:bg-darktext rounded-3xl shadow-lg">
        {/* 프로필 이미지: 카드 내부 상단 중앙 */}
        <div className="absolute -top-[92px]">
          <div className="w-[184px] h-[184px] rounded-full overflow-hidden shadow-md">
            <img
              src={userInfo?.profile || "/profile.png"}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* 사용자 이름 표시 */}
        {userInfo && (
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-lighttext dark:text-white">
              {userInfo.nickname || userInfo.username || "사용자"}
            </h2>
            {userInfo.email && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userInfo.email}
              </p>
            )}
          </div>
        )}
        
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
      
      {/* 회원 탈퇴 모달 */}
      <Modal
        isOpen={isModalOpen}
        type="error"
        title="회원 탈퇴"
        content={
          error 
            ? `오류: ${error}` 
            : "정말 탈퇴하시겠습니까? 탈퇴하면 모든 데이터가 삭제됩니다!"
        }
        confirmText={isLoading ? "처리 중..." : "탈퇴하기"}
        cancelText="취소"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        disabled={isLoading}
      />
    </main>
  );
}