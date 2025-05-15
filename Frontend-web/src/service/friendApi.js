import api from "./axiosInstance";

// QR 코드 생성
export const generateQRCode = (username) =>
  api.get(`/api/friends/qr/${username}`, { responseType: 'arraybuffer' });

// 친구 초대 (QR 코드 데이터 등 페이로드로 전달)
export const inviteFriend = (payload) =>
  api.post("/api/friends/invite/", payload);

// 친구 요청 수락
export const acceptFriend = (friendId) =>
  api.post(`/api/friends/${friendId}/accept/`);

// 친구 요청 거절
export const rejectFriend = (friendId) =>
  api.post(`/api/friends/${friendId}/reject/`);
