import { useEffect } from "react";
import RowCard from "../components/RowCard";
import testimage from "../assets/profile.png";
import emptyImage from "../assets/empty.png";
import useNotificationStore from "../store/notificationStore";
import useUiStore from "../store/uiStore";

export default function NotificationsPage() {
  // Zustand 스토어 사용
  const { 
    notifications, 
    isLoading, 
    error, 
    fetchNotifications, 
    updateNotification, 
    deleteNotification, 
    markAsRead 
  } = useNotificationStore();
  
  const { openModal } = useUiStore();

  // 컴포넌트 마운트 시 알림 목록 가져오기
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  //알림 수정
  const handleEdit = async (id) => {
    openModal('confirm', {
      title: '알림 수정',
      content: '알림을 수정하시겠습니까?',
      onConfirm: async () => {
        try {
          await updateNotification(id, {
            notificationtype: "수정됨",
            notificationmessage: "수정된 알림 메시지입니다.",
          });
          
          openModal('success', {
            title: '알림 수정 완료',
            content: '알림이 수정되었습니다.',
            onConfirm: () => null
          });
        } catch (err) {
          openModal('error', {
            title: '알림 수정 실패',
            content: err.message || '알림 수정 중 오류가 발생했습니다.',
            onConfirm: () => null
          });
        }
      }
    });
  };

  //알림 삭제
  const handleDelete = async (id) => {
    openModal('confirm', {
      title: '알림 삭제',
      content: '알림을 삭제하시겠습니까?',
      onConfirm: async () => {
        try {
          await deleteNotification(id);
          
          openModal('success', {
            title: '알림 삭제 완료',
            content: '알림이 삭제되었습니다.',
            onConfirm: () => null
          });
        } catch (err) {
          openModal('error', {
            title: '알림 삭제 실패',
            content: err.message || '알림 삭제 중 오류가 발생했습니다.',
            onConfirm: () => null
          });
        }
      }
    });
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="notifications-panel flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lightGold"></div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className="notifications-panel flex flex-col w-full items-center justify-center min-h-[200px]">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-lightOrange dark:bg-darkOrange rounded-md text-white"
          onClick={() => fetchNotifications()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="notifications-panel flex flex-col gap-4 w-full">
      {notifications.length > 0 ? (
        notifications.map((noti) => (
          <RowCard
            key={noti.id}
            emojiSrc={testimage}
            headerText={
              <div className="flex items-center gap-2">
                {noti.title}
                {!noti.isRead && (
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-1" />
                )}
              </div>
            }
            bodyText={noti.detail}
            onClick={() => handleNotificationClick(noti.id)}
            className={`transition-all duration-200 ${
              !noti.isRead ? "bg-lightYellow/10 dark:bg-darkBrown/20" : ""
            }`}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center text-center min-h-[200px]">
          <img
            src={emptyImage}
            alt="알림 없음"
            className="w-24 h-24 mb-2 opacity-80"
          />
          <p className="text-sm text-gray-400">새로운 알림이 없습니다.</p>
        </div>
      )}
    </div>
  );
}