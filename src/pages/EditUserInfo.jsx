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
      <div className="section-container w-full max-w-xl relative pt-[92px] pb-8 flex flex-col items-center bg-yl100 dark:bg-darktext rounded-3xl">
        {/* 프로필 이미지 */}
        <div className="absolute -top-[92px]">
          <div className="profile-img">
            <img
              src="/profile.png"
              alt="프로필 이미지"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5 mt-6">
          {/* 상단 두 칸 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* 닉네임 입력 */}
            <div className="flex-1 text-left">
              <label className="block mb-2 text-sm font-semibold text-lighttext">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="form-input"
              />
            </div>

            {/* 전화번호 입력 */}
            <div className="flex-1 text-left">
              <label className="block mb-2 text-sm font-semibold text-lighttext">
                전화번호
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="010-1234-5678"
                className="form-input"
              />
            </div>
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
              className="form-input"
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
              className="form-input"
            />
          </div>

          {/* 저장 버튼 */}
          <div>
            <button
              type="submit"
              className="w-full py-3 rounded-full font-semibold transition bg-lightGold hover:bg-lightOrange dark:bg-darkOrange dark:hover:bg-darkCopper dark:text-darkBg"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
