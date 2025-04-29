import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const navigate = useNavigate();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* 전체 카드: 프로필 + 회원 정보 */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg px-6 pt-[92px] pb-8 relative flex flex-col items-center">
        {/* 프로필 이미지 */}
        <div className="absolute -top-[92px]">
          <div className="w-[184px] h-[184px] rounded-full overflow-hidden border-4 border-gray-400 bg-white shadow-md">
            <img
              src="/profile.png"
              alt="프로필 이미지"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* 회원 정보 카드 내용 */}
        <div className="w-full mt-6 space-y-6 text-sm text-gray-800">
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
          <div className="flex justify-between">
            <span className="font-semibold">생년월일</span>
            <span>1997-04-17</span>
          </div>
        </div>

        {/* 회원 정보 수정 버튼 */}
        <button
          onClick={() => navigate("/mypage/edit")}
          className="w-full mt-10 py-3 rounded-full bg-gray-400 text-white font-semibold hover:bg-gray-600 transition"
        >
          회원 정보 수정
        </button>
      </div>
    </main>
  );
}
