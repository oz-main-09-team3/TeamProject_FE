import api from './axios';

// 친구 목록 조회
export const getFriendsListApi = async () => {
  return api.get('/api/friends/');
};

// 친구 정보 조회
export const getFriendInfoApi = async (friendId) => {
  return api.get(`/api/friends/${friendId}/`);
};

// 친구 일기 목록 조회
export const getFriendDiariesApi = async (friendId) => {
  return api.get(`/api/frienddiary/${friendId}/`);
};

// 친구 일기 상세 조회
export const getFriendDiaryDetailApi = async (friendId, diaryId) => {
  return api.get(`/api/frienddiary/${friendId}/diary/${diaryId}/`);
};

// 친구 일기 캘린더 조회
export const getFriendCalendarApi = async (friendId) => {
  return api.get(`/api/frienddiary/${friendId}/calendar/`);
};

// QR 코드 이미지 생성
export const generateQRCodeApi = async (username) => {
  return api.get('/api/qrcode/', {
    params: { username },
    responseType: 'arraybuffer'
  });
};

// 친구 초대 (QR 코드 스캔 등)
export const inviteFriendApi = async (inviteData) => {
  return api.post('/api/qrcode/qr-invite/', inviteData);
};

// 친구 요청 수락
export const acceptFriendApi = async (friendId) => {
  return api.post(`/api/friends/${friendId}/accept/`);
};

// 친구 요청 거절
export const rejectFriendApi = async (friendId) => {
  return api.post(`/api/friends/${friendId}/reject/`);
};

// 친구 삭제
export const deleteFriendApi = async (friendId) => {
  return api.delete(`/api/friends/${friendId}/`);
};