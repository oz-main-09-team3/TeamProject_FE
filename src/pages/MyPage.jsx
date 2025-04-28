import React from "react";

function MyPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-50">
      {/* 프로필 이미지 */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brown-500 mb-6">
        <img
          src="/profile.png" // public 폴더 기준 경로
          alt="프로필 이미지"
          className="object-cover w-full h-full"
        />
      </div>

      {/* 프로필 카드 */}
      <section className="bg-white rounded-lg shadow-md px-8 py-6 w-80 border border-gray-200 text-gray-800">
        <div className="space-y-4">
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

        {/* 버튼 */}
        <button className="w-full mt-6 py-2 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600">
          회원 정보 수정
        </button>
      </section>
    </main>
  );
}

export default MyPage;
