import api from "./axiosInstance";

// 알림 조회
export const fetchNotifications = () => api.get("/api/notifications/");

// 알림 생성
// payload 예시: { title: '새 알림', message: '내용', target_user: 123 }
export const createNotification = (payload) =>
  api.post("/api/notifications/", payload);

// 알림 수정
// payload 예시: { title: '수정된 제목', is_read: true }
export const updateNotification = (notificationId, payload) =>
  api.patch(`/api/notifications/${notificationId}/`, payload);

// 알림 삭제 (is_deleted = true)
export const deleteNotification = (notificationId) =>
  api.delete(`/api/notifications/${notificationId}/`);
