import api from "./axiosInstance";

// 일기 전체 조회
export const fetchDiaries = () => api.get("/api/diary/");

// 일기 작성
export const createDiary = (payload) => api.post("/api/diary/", payload);

// 일기 상세 조회
export const fetchDiary = (diaryId) => api.get(`/api/diary/${diaryId}/`);

// 일기 수정
export const updateDiary = (diaryId, payload) =>
  api.patch(`/api/diary/${diaryId}/`, payload);

// 일기 삭제 (is_deleted = true)
export const deleteDiary = (diaryId) => api.delete(`/api/diary/${diaryId}/`);

// 한 달 달력용 대표 감정+ID 조회
export const fetchDiaryCalendar = () => api.get("/api/diary/calendar/");
