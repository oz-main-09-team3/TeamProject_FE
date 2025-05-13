import { useEffect, useState } from "react";
import {
  fetchNotifications,
  updateNotification,
  deleteNotification,
} from "../service/notificationApi";
import RowCard from "../components/RowCard";
import testimage from "../assets/profile.png";
import emptyImage from "../assets/empty.png";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function load() {
      console.log("📡 알림 불러오는 중...");
      try {
        const res = await fetchNotifications(); // API 호출
        console.log("알림 응답:", res.data);

        const parsed = res.data.map((item) => ({
          id: item.notification.notification_id,
          title: item.notification.notificationtype,
          detail: item.notification.notificationmessage,
          isRead: false,
        }));

        setNotifications(parsed);
      } catch (err) {
        console.error("❌ 알림 불러오기 실패:", err);
        console.error("에러 응답:", err.response?.data || err.message);
      }
    }

    load(); //함수 실행
  }, []);

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((noti) =>
        noti.id === id ? { ...noti, isRead: true } : noti
      )
    );
  };

  //알림 수정
  const handleEdit = async (id) => {
    try {
      await updateNotification(id, {
        notificationtype: "수정됨",
        notificationmessage: "수정된 알림 메시지입니다.",
      });
      alert("수정 완료");

      //목록 다시 불러오기
      const res = await fetchNotifications();
      const updated = res.data.map((item) => ({
        id: item.notification.notification_id,
        title: item.notification.notificationtype,
        detail: item.notification.notificationmessage,
        isRead: false,
      }));
      setNotifications(updated);
    } catch (err) {
      console.error("❌ 수정 실패:", err);
    }
  };

  //알림 삭제
  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      alert("삭제 완료");
      setNotifications((prev) => prev.filter((noti) => noti.id !== id));
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
    }
  };

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
