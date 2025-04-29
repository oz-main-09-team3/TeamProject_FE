import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RowCard from "../components/RowCard";
import { FaUser, FaUserFriends, FaChartPie, FaSignOutAlt } from "react-icons/fa";

export default function MyPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* 전체 카드: 프로필 + 리스트 */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg px-6 pt-[92px] pb-8 relative flex flex-col items-center">
        {/* 감자 프로필 이미지 */}
        <div className="absolute -top-[92px]">
          <div className="w-[184px] h-[184px] rounded-full overflow-hidden border-4 border-gray-300 bg-white shadow-md">
            <img
              src="/profile.png"
              alt="프로필 이미지"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* 리스트 */}
        <div className="w-full space-y-4 mt-6">
          <RowCard
            emojiSrc="/profile.png"
            headerText="회원 정보"
            bodyText="내 정보를 확인하고 수정해요"
            rightIcon={<FaUser />}
            onClick={() => navigate("/mypage/info")}
          />
          <RowCard
            emojiSrc="/qrcode.png"
            headerText="친구 초대 (QR 코드)"
            bodyText="QR 코드를 통해 친구를 초대해요"
            rightIcon={<span>➔</span>}
            onClick={() => navigate("/mypage/qrcode")}
          />
          <RowCard
            emojiSrc="/chart.png"
            headerText="감정 통계표"
            bodyText="나의 감정 기록을 한눈에 보기"
            rightIcon={<span>➔</span>}
            onClick={() => navigate("/mypage/chart")}
          />
          <RowCard
            emojiSrc="/logout.png"
            headerText="회원 탈퇴"
            bodyText="계정을 탈퇴할 수 있어요"
            rightIcon={<FaSignOutAlt />}
            onClick={() => setIsModalOpen(true)} // 이제 모달 열기
          />
        </div>
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white w-[592px] h-[228px] p-6 rounded-[4px] shadow-md flex flex-col justify-between">
      {/* 모달 내용 */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-900">회원 탈퇴</h2>
        <p className="text-gray-600 text-sm">
          정말 탈퇴하시겠습니까? 탈퇴하면 모든 데이터가 삭제됩니다!
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300"
          onClick={() => setIsModalOpen(false)}
        >
          네
        </button>
        <button
          className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            console.log('회원 탈퇴 진행');
            setIsModalOpen(false);
          }}
        >
          아니요
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}
