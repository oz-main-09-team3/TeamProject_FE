import api from "./axiosInstance";

// 좋아요 추가
export const addLike = (diaryId) => api.post(`/api/diary/${diaryId}/like/`);

// 좋아요 취소 (is_deleted = true)
export const removeLike = (diaryId) =>
  api.delete(`/api/diary/${diaryId}/like/`);
