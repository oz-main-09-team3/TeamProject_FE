import { useState } from "react";

export default function EditUserInfo() {
  const [nickname, setNickname] = useState("몽이마덜");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("mong@naver.com");
  const [birthdate, setBirthdate] = useState("1997-04-17");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("수정된 닉네임:", nickname);
    console.log("수정된 이메일:", email);
    console.log("수정된 생년월일:", birthdate);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark px-4">
      {/* 전체 카드: 프로필 + 입력 폼 */}
      <div className="w-full max-w-md bg-yl100 dark:bg-darktext rounded-3xl shadow-lg px-6 pt-[92px] pb-8 relative flex flex-col items-center">
        {/* 감자 프로필 이미지 */}
        <div className="absolute -top-[92px]">
          <div className="w-[184px] h-[184px] rounded-full overflow-hidden shadow-md">
            <img
              src="/profile.png"
              alt="프로필 이미지"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* 수정 폼 내용 */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-6">
          {/* 닉네임 입력 */}
          <div className="text-left">
            <label className="block mb-2 text-sm font-semibold text-lighttext">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-3 border border-lightGold dark:border-darkOrange rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* 전화번호 입력 */}
          <div className="text-left">
            <label className="block mb-2 text-sm font-semibold text-lighttext">
              전화번호
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="010-1234-5678"
              className="w-full p-3 border border-lightGold dark:border-darkOrange rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* 이메일 입력 */}
          <div className="text-left">
            <label className="block mb-2 text-sm font-semibold text-lighttext">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-lightGold dark:border-darkOrange rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* 생년월일 입력 */}
          <div className="text-left">
            <label className="block mb-2 text-sm font-semibold text-lighttext">
              생년월일
            </label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full p-3 border border-lightGold dark:border-darkOrange rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* 저장 버튼 */}
          <button
            type="submit"
            className="w-full py-3 rounded-full font-semibold transition bg-lightGold hover:bg-lightOrange dark:bg-darkOrange dark:hover:bg-darkCopper dark:text-darkBg"
          >
            저장하기
          </button>
        </form>
      </div>
    </main>
  );
}
