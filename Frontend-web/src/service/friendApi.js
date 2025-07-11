import api from "./axios";

// 친구 목록 조회
export const getFriendsList = () =>
  api.get("/api/friends/");

// 친구 정보 조회
export const getFriendInfo = (friendId) =>
  api.get(`/api/friends/${friendId}/`);

// QR 코드 이미지 생성
export const generateQRCode = (username) =>
  api.get(`/api/qrcode/`, {
    params: { username },
    responseType: 'arraybuffer' 
  });

// 친구 초대 (QR 코드 데이터 등 페이로드로 전달)
export const inviteFriend = (payload) =>
  api.post("/api/qrcode/qr-invite/", payload);

// 친구 요청 수락
export const acceptFriend = (friendId) =>
  api.post(`/api/friends/${friendId}/accept/`);

// 친구 요청 거절
export const rejectFriend = (friendId) =>
  api.post(`/api/friends/${friendId}/reject/`);
