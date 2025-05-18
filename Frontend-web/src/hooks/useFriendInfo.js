import { useState, useEffect } from "react";
import { getFriendInfo } from "../service/friendApi";

// 개발 환경 테스트용 임시 친구 정보
const MOCK_FRIEND_INFO = {
  id: 1,
  username: "test_friend",
  nickname: "테스트 친구",
  profile: null
};

export const useFriendInfo = (friendId) => {
  const [friendInfo, setFriendInfo] = useState(MOCK_FRIEND_INFO);
  const [error, setError] = useState(null);

  const fetchFriendInfo = async () => {
    try {
      // 개발 환경에서는 임시 친구 정보 사용
      if (import.meta.env.DEV) {
        setFriendInfo(MOCK_FRIEND_INFO);
        return;
      }

      const response = await getFriendInfo(friendId);
      if (response?.data) {
        setFriendInfo(response.data);
      }
    } catch (err) {
      console.error("친구 정보 불러오기 실패:", err);
      setError("친구 정보를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchFriendInfo();
  }, [friendId]);

  return { friendInfo, error };
}; 