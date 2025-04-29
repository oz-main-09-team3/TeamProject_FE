import React from "react";
import { useNavigate } from "react-router-dom";
import RowCard from "../components/RowCard";
import {
  FaUser,
  FaUserFriends,
  FaChartPie,
  FaSignOutAlt,
} from "react-icons/fa";

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* 전체 카드: 프로필 + 리스트 */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg px-6 pt-[92px] pb-8 relative flex flex-col items-center">
        {/* 감자 프로필 이미지 (카드 안에서 위로 겹치기) */}
        <div className="absolute -top-[92px]">
          <div className="w-[184px] h-[184px] rounded-full overflow-hidden border-4 border-gray-300 bg-white shadow-md">
            <img
              src="/profile.png"
              alt="프로필 이미지"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* 중앙에 정렬된 리스트 카드들 */}
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
            onClick={() => navigate("/delete-account")}
          />
        </div>
      </div>
    </main>
  );
}
