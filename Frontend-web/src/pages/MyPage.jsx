import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RowCard from "../components/RowCard";
import MENU_ITEMS_ORIGIN from "../constants/menuItems.jsx";
import { FiUserX, FiLogOut } from "react-icons/fi";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";

// 회원 탈퇴 아이템을 찾아서 아이콘 교체
const MENU_ITEMS = MENU_ITEMS_ORIGIN.map(item =>
  item.id === 'withdraw'
    ? { ...item, rightIcon: <FiUserX size={22} color="red" /> }
    : item
);

export default function MyPage() {
  const navigate = useNavigate();
  
  // Zustand 스토어 사용
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    fetchUserInfo, 
    logout, 
    deleteUserAccount 
  } = useAuthStore();
  
  const { openModal } = useUiStore();

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, fetchUserInfo, navigate]);

  // 회원 탈퇴 처리
  const handleWithdraw = () => {
    openModal('error', {
      title: '회원 탈퇴',
      content: '정말 탈퇴하시겠습니까? 탈퇴하면 모든 데이터가 삭제됩니다!',
      onConfirm: async () => {
        try {
          await deleteUserAccount();
          openModal('success', {
            title: '탈퇴 완료',
            content: '회원 탈퇴가 완료되었습니다.',
            onConfirm: () => navigate('/login')
          });
        } catch (err) {
          openModal('error', {
            title: '탈퇴 실패',
            content: err.message || '회원 탈퇴 중 오류가 발생했습니다.',
            onConfirm: () => null
          });
        }
      }
    });
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    openModal('confirm', {
      title: '로그아웃',
      content: '로그아웃 하시겠습니까?',
      onConfirm: async () => {
      try {
        await logout();
        // '/login' 대신 '/'로 이동 (루트 경로가 로그인 페이지)
        navigate('/', { replace: true });
      } catch (err) {
        navigate('/', { replace: true });
      }
    }
  });
};
  const handleMenuClick = (item) => {
    if (item.id === 'withdraw') {
      handleWithdraw();
    } else if (item.path) {
      navigate(item.path, { state: { userInfo: user } });
    }
  };

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark">
        <div className="text-2xl text-lighttext dark:text-darktext">
          사용자 정보를 불러오는 중...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark">
        <div className="text-red-500">
          {error}
        </div>
      </main>
    );
  }

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
              src={user?.profile || "/profile.png"}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/profile.png"; }}
            />
          </div>
        </div>
        
        {/* 사용자 이름 표시 */}
        {user && (
          <div className="text-center m-2">
            <h2 className="text-xl font-bold text-lighttext dark:text-white">
              {user.nickname || user.username || "사용자"}
            </h2>
            {user.email && (
              <p className="text-sm text-lighttext/60 dark:text-darkBg/60">
                {user.email}
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