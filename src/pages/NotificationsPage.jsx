import RowCard from "../components/RowCard";
import testimage from "../assets/profile.png";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "새로운 친구 요청",
      detail: "김오즈님이 친구 요청을 보냈어요!",
    },
    {
      id: 2,
      title: "감정 기록 알림",
      detail: "오늘 하루 감정을 기록해보세요!",
    },
    {
      id: 3,
      title: "기록 리마인드",
      detail: "어제 기록을 잊지 않으셨나요?",
    },
  ];
  const moodImageSrc = testimage;

  return (
    <div className="flex flex-col gap-4 w-full">
      {notifications.map((noti) => (
        <RowCard
          key={noti.id}
          emojiSrc={moodImageSrc}
          headerText={noti.title}
          bodyText={noti.detail}
          onClick={() => console.log(`${noti.title} 클릭됨`)}
        />
      ))}
    </div>
  );
}
