import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RowCard from "../components/RowCard";
import MENU_ITEMS_ORIGIN from "../constants/menuItems.jsx";
import { FiUserX, FiLogOut } from "react-icons/fi";
import { deleteAccount, getMyInfo } from "../service/userApi";
import { logout } from "../service/authApi";
import useUiStore from "../store/uiStore";
import useAuthStore from "../store/authStore";

// 회원 탈퇴 아이템을 찾아서 아이콘 교체
const MENU_ITEMS = MENU_ITEMS_ORIGIN.map(item =>
  item.id === 'withdraw'
    ? { ...item, rightIcon: <FiUserX size={22} color="red" /> }
    : item
);

export default function MyPage() {
  const navigate = useNavigate();
  const { openModal } = useUiStore();
  const { logout: authLogout, withdraw } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
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
        openModal('error', {
          title: '오류',
          content: '사용자 정보를 불러오는데 실패했습니다.',
          confirmText: '확인'
        });
      }
    };

    fetchUserInfo();
  }, [openModal]);

  // 회원 탈퇴 처리
  const handleWithdraw = () => {
    openModal('warning', {
      title: '회원 탈퇴',
      content: '정말 탈퇴하시겠습니까? 탈퇴하면 모든 데이터가 삭제됩니다!',
      confirmText: '탈퇴하기',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          setIsLoading(true);
          await withdraw();
          openModal('success', {
            title: '완료',
            content: '회원 탈퇴가 완료되었습니다.',
            confirmText: '확인',
            onConfirm: () => navigate('/login')
          });
        } catch (err) {
          console.error("회원 탈퇴 실패:", err);
          openModal('error', {
            title: '오류',
            content: err.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다.',
            confirmText: '확인'
          });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleMenuClick = (item) => {
    if (item.id === 'withdraw') {
      handleWithdraw();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    openModal('confirm', {
      title: '로그아웃',
      content: '정말 로그아웃 하시겠습니까?',
      confirmText: '로그아웃',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await authLogout();
          openModal('success', {
            title: '완료',
            content: '로그아웃 되었습니다.',
            confirmText: '확인',
            onConfirm: () => navigate('/')
          });
        } catch (err) {
          console.error("로그아웃 실패:", err);
          // API 호출이 실패하더라도 로컬에서 로그아웃 처리
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark">
      <div className="w-full max-w-md relative pt-[100px] pb-6 flex flex-col gap-1 items-center bg-yl100 dark:bg-darktext rounded-3xl shadow-lg">
        {/* 프로필 이미지: 카드 내부 상단 중앙 */}
        <div className="absolute -top-[92px]">
          <div
            className="w-[184px] h-[184px] rounded-full overflow-hidden shadow-xl border-4"
            style={{ borderColor: "transparent" }}
          >
            <img
              src={userInfo?.profile || "/profile.png"}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* 사용자 이름 표시 */}
        {userInfo && (
          <div className="text-center m-2">
            <h2 className="text-xl font-bold text-lighttext dark:text-darkBg">
              {userInfo.nickname || userInfo.username || "사용자"}
            </h2>
            {userInfo.email && (
              <p className="text-sm text-lighttext/60 dark:text-darkBg/60">
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
    </main>
  );
}