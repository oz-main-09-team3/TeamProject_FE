import RowCard from "../components/RowCard";
import testimage from "../assets/profile.png";
import emptyImage from "../assets/empty.png";
import { useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "새로운 친구 요청",
      detail: "김오즈님이 친구 요청을 보냈어요!",
      isRead: false,
    },
    {
      id: 2,
      title: "감정 기록 알림",
      detail: "오늘 하루 감정을 기록해보세요!",
      isRead: true,
    },
    {
      id: 3,
      title: "기록 리마인드",
      detail: "어제 기록을 잊지 않으셨나요?",
      isRead: false,
    },
  ]);

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(noti => 
      noti.id === id ? { ...noti, isRead: true } : noti
    ));
  };

  const moodImageSrc = testimage;

  return (
    <div className="notifications-panel flex flex-col gap-4 w-full">
      {notifications.length > 0 ? (
        notifications.map((noti) => (
          <RowCard
            key={noti.id}
            emojiSrc={moodImageSrc}
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
              !noti.isRead ? 'bg-lightYellow/10 dark:bg-darkBrown/20' : ''
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
