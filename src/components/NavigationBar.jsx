import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserFriends, FaBell, FaUser } from 'react-icons/fa';

export default function NavigationBar({ onFriendsClick }) { // ✅ onFriendsClick props 받기
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 right-0 flex gap-6 p-4 bg-gray-200">
      {/* 캘린더 버튼 (페이지 이동) */}
      <button onClick={() => navigate('/main')}>
        <FaCalendarAlt size={24} />
      </button>

      {/* 친구 목록 버튼 (페이지 이동 X, 함수 호출 O) */}
      <button onClick={onFriendsClick}>
        <FaUserFriends size={24} />
      </button>

      {/* 알림 버튼 (페이지 이동) */}
      <button onClick={() => navigate('/notifications')}>
        <FaBell size={24} />
      </button>

      {/* 마이페이지 버튼 (페이지 이동) */}
      <button onClick={() => navigate('/mypage')}>
        <FaUser size={24} />
      </button>
    </div>
  );
}
