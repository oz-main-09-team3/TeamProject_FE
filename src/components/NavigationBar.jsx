import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends, FaBell, FaUser } from "react-icons/fa";
import { TestTube2Icon, TestTubeIcon } from "lucide-react";

export default function NavigationBar({
  onFriendsClick,
  onNotificationsClick,
}) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full flex justify-end gap-6 p-4 bg-gray-200 shadow-md z-50">
      {/* 캘린더로 이동 버튼 */}
      <button onClick={() => navigate("/main")}>
        <FaCalendarAlt size={24} />
      </button>

      {/* 친구 목록 띄우기 버튼 */}
      <button onClick={onFriendsClick}>
        <FaUserFriends size={24} />
      </button>

      {/* 알림 사이드바 열기 버튼 (라우팅 X) */}
      <button onClick={onNotificationsClick}>
        <FaBell size={24} />
      </button>

      {/* 마이페이지 이동 버튼 */}
      <button onClick={() => navigate("/mypage")}>
        <FaUser size={24} />
      </button>

      {/* 테스트 버튼 */}
      <button onClick={() => navigate("/test2")}>
        <TestTube2Icon size={24} />
      </button>
      <button onClick={() => navigate("/test3")}>
        <TestTube2Icon size={24} />
      </button>
      <button onClick={() => navigate("/test4")}>
        <TestTube2Icon size={24} />
      </button>

      <button onClick={() => navigate("/test5")}>
        <TestTube2Icon size={24} />
      </button>
    </div>
  );
}
