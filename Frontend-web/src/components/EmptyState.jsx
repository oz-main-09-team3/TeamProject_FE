import React from "react";
import emptyImg from "../assets/empty.png"; // 경로 주의!

function EmptyState({ message = "불러오기 실패" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <img src={emptyImg} alt="empty" style={{ width: 120, height: 120, marginBottom: 16 }} />
      <div className="text-lg text-gray-500">{message}</div>
    </div>
  );
}

export default EmptyState;