import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10">
      {/* 프로필 이미지 */}
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-400 mb-8">
        <img
          src="/profile.png" // public 폴더 기준 경로
          alt="프로필 이미지"
          className="object-cover w-full h-full"
        />
      </div>

      {/* 회원 정보 카드 */}
      <section className="bg-white rounded-lg shadow-lg px-8 py-6 w-80 border border-gray-200 text-gray-800">
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">닉네임</span>
            <span>몽이마덜</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">아이디</span>
            <span>mong333</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">이메일</span>
            <span>mong@naver.com</span>
          </div>
        </div>

        {/* 수정 버튼 */}
        <button
          className="w-full mt-8 py-2 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
          onClick={() => navigate("/mypage/edit")}
        >
          회원 정보 수정
        </button>
      </section>
    </main>
  );
}
