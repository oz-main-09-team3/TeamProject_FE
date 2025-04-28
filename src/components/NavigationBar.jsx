import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserFriends, FaBell, FaUser } from 'react-icons/fa';
import { TestTube2Icon, TestTubeIcon } from 'lucide-react';

export default function NavigationBar() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 right-0 flex gap-6 p-4 bg-gray-200">
      <button onClick={() => navigate('/main')}>
        <FaCalendarAlt size={24} />
      </button>
      <button onClick={() => navigate('/friends')}>
        <FaUserFriends size={24} />
      </button>
      <button onClick={() => navigate('/notifications')}>
        <FaBell size={24} />
      </button>
      <button onClick={() => navigate('/mypage')}>
        <FaUser size={24} />
      </button>
      <button onClick={() => navigate('/test')}>
        <TestTubeIcon size={24} />
      </button>
      <button onClick={() => navigate('/test1')}>
        <TestTube2Icon size={24} />
      </button>
    </div>
  );
}
