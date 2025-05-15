import api from "./axios";

// QR 코드 이미지 생성
export const generateQRCode = (username) =>
  api.get(`/api/qrcode/`, {
    params: { username },
    responseType: 'arraybuffer'  // 이미지 데이터를 받기 위해
  });

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
