import api from "./axiosInstance";

// 특정 일기의 이미지 목록 조회
export const fetchDiaryImages = (diaryId) =>
  api.get(`/api/diary/${diaryId}/images/`);

// 일기 이미지 업로드
// formData: 반드시 multipart/form-data 로 전달
export const uploadDiaryImage = (diaryId, formData) =>
  api.post(`/api/diary/${diaryId}/images/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 일기 이미지 삭제 (is_deleted = true)
export const deleteDiaryImage = (diaryId, imageId) =>
  api.delete(`/api/diary/${diaryId}/images/${imageId}/`);
