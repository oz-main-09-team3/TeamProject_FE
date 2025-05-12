import { useReducer, useRef, useState } from "react";
import { Camera } from "lucide-react";
import ColorThief from 'colorthief';
import Modal from '../components/Modal';
import { useNavigate } from "react-router-dom";

const initialState = {
  nickname: "몽이마덜",
  phoneNumber: "",
  email: "mong@naver.com",
  birthdate: "1997-04-17",
  profileImage: "/profile.png"
};

function reducer(state, action) {
  return { ...state, [action.name]: action.value };
}

export default function EditUserInfo() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [borderColor, setBorderColor] = useState('transparent');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('warning');
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 미래 날짜 방지: 미래 날짜면 today로 자동 변경
    if (name === 'birthdate') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (value > todayStr) {
        dispatch({ name, value: todayStr });
        setBirthdateError('미래의 날짜는 선택할 수 없습니다.');
        return;
      }
    }
    dispatch({ name, value });

    // 이메일 유효성 검사
    if (name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setEmailError('올바른 이메일 형식이 아닙니다.');
      } else {
        setEmailError('');
      }
    }

    // 전화번호 유효성 검사
    if (name === 'phoneNumber') {
      const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
      if (value && !phoneRegex.test(value)) {
        setPhoneError('올바른 전화번호 형식이 아닙니다.');
      } else {
        setPhoneError('');
      }
    }

    // 생년월일 유효성 검사
    if (name === 'birthdate') {
      const today = new Date();
      const birthDate = new Date(value);
      const minDate = new Date('1900-01-01');
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // 만 나이 계산 (생일이 지났는지 확인)
      const isBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && today.getDate() >= birthDate.getDate());
      const actualAge = isBirthdayPassed ? age : age - 1;
      
      if (birthDate < minDate) {
        setBirthdateError('1900년 이후의 날짜만 입력 가능합니다.');
      } else if (actualAge < 14) {
        setBirthdateError('14세 이상만 가입 가능합니다.');
      } else if (birthDate > today) {
        setBirthdateError('미래의 날짜는 선택할 수 없습니다.');
      } else {
        setBirthdateError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 입력란 순서대로(전화번호 → 이메일 → 생년월일) 가장 먼저 발견된 에러만 모달에 띄움
    if (phoneError) {
      setModalMessage('전화번호 형식이 올바르지 않습니다.');
      setModalType('warning');
      setShowModal(true);
      return;
    }
    if (emailError) {
      setModalMessage('이메일 형식이 올바르지 않습니다.');
      setModalType('warning');
      setShowModal(true);
      return;
    }
    if (birthdateError) {
      setModalMessage('생년월일이 올바르지 않습니다.');
      setModalType('warning');
      setShowModal(true);
      return;
    }
    // 모든 입력이 올바르면 성공 모달
    setModalMessage('저장되었습니다.');
    setModalType('success');
    setShowModal(true);
    // 실제 저장 로직은 여기에 추가
    console.log("수정된 정보:", state);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getDominantColor = (img) => {
    const colorThief = new ColorThief();
    const color = colorThief.getColor(img);
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ name: 'profileImage', value: reader.result });
        
        // 이미지가 로드된 후 색상 추출
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const color = getDominantColor(img);
          setBorderColor(color);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalType === 'success') {
      navigate('/mypage/info');
    }
  };

  // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark px-4">
        <div className="w-full max-w-xl relative pt-[92px] pb-8 flex flex-col items-center bg-white dark:bg-darktext rounded-3xl shadow-lg">
          {/* 프로필 이미지 */}
          <div className="absolute -top-[92px]">
            <div className="relative group">
              <div 
                className="w-[184px] h-[184px] rounded-full overflow-hidden border-4 transition-colors duration-300"
                style={{ borderColor: borderColor }}
              >
                <img
                  ref={imageRef}
                  src={state.profileImage}
                  alt="프로필 이미지"
                  className="object-cover w-full h-full"
                />
              </div>
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleImageClick}
              >
                <Camera className="w-8 h-8 text-white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5 mt-6 px-6">
            {/* 상단 두 칸 */}
            <div className="flex flex-col md:flex-row gap-6">
              <FormInput
                label="닉네임"
                name="nickname"
                value={state.nickname}
                onChange={handleChange}
              />
              <div className="flex-1 text-left">
                <label className="block mb-2 text-sm font-semibold text-lighttext dark:text-darkBg">전화번호</label>
                <input 
                  type="tel"
                  name="phoneNumber"
                  placeholder="010-1234-5678"
                  value={state.phoneNumber}
                  onChange={handleChange}
                  className={`form-input text-lighttext dark:text-darkBg placeholder:text-gray-500 dark:placeholder:text-gray-500 ${phoneError ? 'border-red-500' : ''}`}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-500">{phoneError}</p>
                )}
              </div>
            </div>

            <div className="flex-1 text-left">
              <label className="block mb-2 text-sm font-semibold text-lighttext dark:text-darkBg">이메일</label>
              <input 
                type="text"
                name="email"
                value={state.email}
                onChange={handleChange}
                className={`form-input text-lighttext dark:text-darkBg placeholder:text-gray-500 dark:placeholder:text-gray-500 ${emailError ? 'border-red-500' : ''}`}
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>

            <div className="flex-1 text-left">
              <label className="block mb-2 text-sm font-semibold text-lighttext dark:text-darkBg">생년월일</label>
              <input 
                type="date"
                name="birthdate"
                value={state.birthdate}
                onChange={handleChange}
                max={today}
                min="1900-01-01"
                className={`form-input text-lighttext dark:text-darkBg placeholder:text-gray-500 dark:placeholder:text-gray-500 ${birthdateError ? 'border-red-500' : ''}`}
                onInvalid={e => e.target.setCustomValidity('')}
              />
              {birthdateError && (
                <p className="mt-1 text-sm text-red-500">{birthdateError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full font-semibold transition bg-lightGold hover:bg-lightOrange dark:bg-darkOrange dark:hover:bg-darkCopper dark:text-darkBg"
            >
              저장하기
            </button>
          </form>
        </div>
      </main>

      {/* 공통 Modal 컴포넌트 사용 */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={modalType === 'success' ? '완료' : '입력 오류'}
        content={modalMessage}
        confirmText="확인"
        onConfirm={closeModal}
        type={modalType}
      />
    </>
  );
}

// forminput 을 사용해서 공통컴포넌트
function FormInput({ label, ...rest }) {
  return (
    <div className="flex-1 text-left">
      <label className="block mb-2 text-sm font-semibold text-lighttext dark:text-darkBg">{label}</label>
      <input 
        {...rest} 
        className="form-input text-lighttext dark:text-darkBg placeholder:text-gray-500 dark:placeholder:text-gray-500" 
      />
    </div>
  );
}
