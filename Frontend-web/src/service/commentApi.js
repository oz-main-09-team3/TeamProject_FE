import api from "./axiosInstance";

// 댓글 목록 조회
export const fetchComments = (diaryId) =>
  api.get(`/api/diary/${diaryId}/comments/`);

// 댓글 작성
// payload 예시: { content: '멋진 일기네요!' }
export const createComment = (diaryId, payload) =>
  api.post(`/api/diary/${diaryId}/comments/`, payload);

// 댓글 수정
// payload 예시: { content: '수정된 댓글 내용' }
export const updateComment = (diaryId, commentId, payload) =>
  api.patch(`/api/diary/${diaryId}/comments/${commentId}/`, payload);

// 댓글 삭제 (is_deleted = true)
export const deleteComment = (diaryId, commentId) =>
  api.delete(`/api/diary/${diaryId}/comments/${commentId}/`);
