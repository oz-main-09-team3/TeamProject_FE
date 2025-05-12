import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const navigate = useNavigate();

  return (
    <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark px-4">
      {/* 전체 카드: 프로필 + 회원 정보 */}
      <div className="w-full max-w-md bg-yl100 dark:bg-darktext rounded-3xl shadow-lg px-6 pt-[92px] pb-8 relative flex flex-col items-center">
        {/* 프로필 이미지 */}
        <div className="absolute -top-[92px]">
          <div className="w-[184px] h-[184px] rounded-full overflow-hidden shadow-md">
            <img
              src="/profile.png"
              alt="프로필 이미지"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* 회원 정보 내용 */}
        <div className="w-full mt-6 space-y-6 text-sm text-lighttext dark:text-darkBg">
          <div className="flex justify-between">
            <span className="font-semibold">닉네임</span>
            <span>몽이마덜</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-semibold">전화번호</span>
            <span>010-1234-5678</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">이메일</span>
            <span>mong@naver.com</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">생년월일</span>
            <span>1997-04-17</span>
          </div>
        </div>

        {/* 회원 정보 수정 버튼 */}
        <button
          onClick={() => navigate("/mypage/edit")}
          className="w-full mt-10 py-3 rounded-full font-semibold transition bg-lightGold hover:bg-lightOrange dark:bg-darkOrange dark:hover:bg-darkCopper dark:text-darkBg"
        >
          회원 정보 수정
        </button>
      </div>
    </main>
  );
}
