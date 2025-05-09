import { useReducer } from "react";

const initialState = {
  nickname: "몽이마덜",
  phoneNumber: "",
  email: "mong@naver.com",
  birthdate: "1997-04-17",
};

function reducer(state, action) {
  return { ...state, [action.name]: action.value };
}

export default function EditUserInfo() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {
    dispatch({ name: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("수정된 정보:", state);
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
            <FormInput
              label="닉네임"
              name="nickname"
              value={state.nickname}
              onChange={handleChange}
            />
            <FormInput
              label="전화번호"
              name="phoneNumber"
              type="tel"
              placeholder="010-1234-5678"
              value={state.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <FormInput
            label="이메일"
            name="email"
            type="email"
            value={state.email}
            onChange={handleChange}
          />

          <FormInput
            label="생년월일"
            name="birthdate"
            type="date"
            value={state.birthdate}
            onChange={handleChange}
          />

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

// forminput 을 사용해서 공통컴포넌트
function FormInput({ label, ...rest }) {
  return (
    <div className="flex-1 text-left">
      <label className="block mb-2 text-sm font-semibold text-lighttext">{label}</label>
      <input {...rest} className="form-input" />
    </div>
  );
}
