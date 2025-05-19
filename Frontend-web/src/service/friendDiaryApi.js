import api from "./axios";

// 친구의 다이어리 캘린더 조회
export const fetchFriendDiaryCalendar = (friendId) => 
  api.get(`/api/frienddiary/${friendId}/calendar`);

// 친구의 특정 날짜 다이어리 목록 조회
export const fetchFriendDiaryByDate = (friendId, date) => 
  api.get(`/api/frienddiary/${friendId}/date/${date}`);

// 친구의 특정 다이어리 상세 조회
export const fetchFriendDiaryDetail = (friendId, diaryId) => 
  api.get(`/api/frienddiary/${friendId}/diary/${diaryId}`);