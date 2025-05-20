import api from './axios';

// 댓글 목록 조회
export const fetchCommentsApi = async (diaryId) => {
  return api.get(`/api/diary/${diaryId}/comments/`);
};

// 댓글 작성
export const createCommentApi = async (diaryId, commentData) => {
  return api.post(`/api/diary/${diaryId}/comments/`, commentData);
};

// 댓글 수정
export const updateCommentApi = async (diaryId, commentId, commentData) => {
  return api.patch(`/api/diary/${diaryId}/comments/${commentId}/`, commentData);
};

// 댓글 삭제
export const deleteCommentApi = async (diaryId, commentId) => {
  return api.delete(`/api/diary/${diaryId}/comments/${commentId}/`);
};

// 친구 일기 댓글 API
export const createFriendCommentApi = async (friendId, diaryId, commentData) => {
  return api.post(`/api/frienddiary/${friendId}/diary/${diaryId}/comments/`, commentData);
};

export const updateFriendCommentApi = async (friendId, diaryId, commentId, commentData) => {
  return api.patch(`/api/frienddiary/${friendId}/diary/${diaryId}/comments/${commentId}/`, commentData);
};

export const deleteFriendCommentApi = async (friendId, diaryId, commentId) => {
  return api.delete(`/api/frienddiary/${friendId}/diary/${diaryId}/comments/${commentId}/`);
};