import api from "./axios";

// 댓글 작성
export const createFriendComment = (friendId, diaryId, payload) =>
  api.post(`/api/frienddiary/${friendId}/diary/${diaryId}/comments/`, payload);

// 댓글 수정
export const updateFriendComment = (friendId, diaryId, commentId, payload) =>
  api.patch(`/api/frienddiary/${friendId}/diary/${diaryId}/comments/${commentId}/`, payload);

// 댓글 삭제
export const deleteFriendComment = (friendId, diaryId, commentId) =>
  api.delete(`/api/frienddiary/${friendId}/diary/${diaryId}/comments/${commentId}/`);
