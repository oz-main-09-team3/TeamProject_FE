import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="p-2 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-8 h-8 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors"
      title="뒤로 가기"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  );
} 