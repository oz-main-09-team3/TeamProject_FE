import { create } from 'zustand';
import {
  fetchNotifications,
  updateNotification,
  deleteNotification
} from '../service/notificationApi';

const useNotificationStore = create((set, get) => ({
  // 상태
  notifications: [],
  isLoading: false,
  error: null,
  
  // 액션
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchNotifications();
      console.log("알림 응답:", response.data);
      
      const parsed = response.data.map((item) => ({
        id: item.notification.notification_id,
        title: item.notification.notificationtype,
        detail: item.notification.notificationmessage,
        isRead: false,
      }));
      
      set({ notifications: parsed, isLoading: false });
      return parsed;
    } catch (err) {
      console.error("❌ 알림 불러오기 실패:", err);
      set({ error: err.message, isLoading: false });
      return [];
    }
  },
  
  updateNotification: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await updateNotification(id, data);
      
      // 로컬 상태 업데이트
      set(state => ({
        notifications: state.notifications.map(noti => 
          noti.id === id 
            ? { 
                ...noti, 
                title: data.notificationtype || noti.title,
                detail: data.notificationmessage || noti.detail,
                isRead: data.is_read !== undefined ? data.is_read : noti.isRead
              } 
            : noti
        ),
        isLoading: false
      }));
      
      return true;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
  
  deleteNotification: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteNotification(id);
      
      // 로컬 상태에서 알림 제거
      set(state => ({
        notifications: state.notifications.filter(noti => noti.id !== id),
        isLoading: false
      }));
      
      return true;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
  
  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(noti => 
        noti.id === id ? { ...noti, isRead: true } : noti
      )
    }));
  },
  
  clearError: () => set({ error: null })
}));

export default useNotificationStore;