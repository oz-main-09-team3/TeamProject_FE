import { useReducer, useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";
import { formatPhoneNumber, formatDateYYYYMMDD } from "../utils/dateUtils";

function reducer(state, action) {
  return { ...state, [action.name]: action.value };
}

export default function EditUserInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Zustand 스토어 사용
  const { user, updateUserInfo, isLoading, error } = useAuthStore();
  const { openModal } = useUiStore();
  
  const receivedUserInfo = location.state?.userInfo || user;
  
  const initialState = {
    nickname: receivedUserInfo?.nickname || receivedUserInfo?.username || "",
    phone_number: formatPhoneNumber(receivedUserInfo?.phone_number || receivedUserInfo?.phone || receivedUserInfo?.phone_num || ""),
    email: receivedUserInfo?.email || "",
    birth_date: formatDateYYYYMMDD(receivedUserInfo?.birth_date || receivedUserInfo?.birthdate || receivedUserInfo?.birthday || ""),
    profile_image: receivedUserInfo?.profile_image || receivedUserInfo?.profile || "/profile.png"
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [borderColor, setBorderColor] = useState('transparent');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(receivedUserInfo?.profile_image || "/profile.png");
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // 사용자 정보가 있으면 폼 필드 초기화
    if (receivedUserInfo) {
      dispatch({ name: 'nickname', value: receivedUserInfo?.nickname || receivedUserInfo?.username || "" });
      dispatch({ name: 'phone_number', value: formatPhoneNumber(receivedUserInfo?.phone_number || receivedUserInfo?.phone || receivedUserInfo?.phone_num || "") });
      dispatch({ name: 'email', value: receivedUserInfo?.email || "" });
      dispatch({ name: 'birth_date', value: formatDateYYYYMMDD(receivedUserInfo?.birth_date || receivedUserInfo?.birthdate || receivedUserInfo?.birthday || "") });
      
      // 프로필 이미지 설정
      if (receivedUserInfo?.profile) {
        const profileUrl = receivedUserInfo.profile.startsWith('http') 
          ? receivedUserInfo.profile 
          : `${import.meta.env.VITE_BACKEND_URL}${receivedUserInfo.profile}`;
        setProfileImageUrl(profileUrl);
      }
    }
  }, [receivedUserInfo]);

  const getProfileImageUrl = () => {
    if (profileImageFile && state.profile_image && state.profile_image.startsWith('data:')) {
      return state.profile_image;
    }
    if (profileImageUrl) {
      return profileImageUrl;
    }
    return "/profile.png";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'birth_date') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (value > todayStr) {
        dispatch({ name, value: todayStr });
        setBirthdateError('미래의 날짜는 선택할 수 없습니다.');
        return;
      }
    }

    if (name === 'phone_number') {
      let onlyNums = value.replace(/[^0-9]/g, '');
      let formatted = onlyNums;
      if (onlyNums.length < 4) {
      } else if (onlyNums.length < 8) {
        formatted = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
      } else if (onlyNums.length < 11) {
        formatted = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7);
      } else {
        formatted = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7, 11);
      }
      dispatch({ name, value: formatted });
      const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
      if (value && !phoneRegex.test(formatted)) {
        setPhoneError('올바른 전화번호 형식이 아닙니다.');
      } else {
        setPhoneError('');
      }
      return;
    }

    dispatch({ name, value });

    if (name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setEmailError('올바른 이메일 형식이 아닙니다.');
      } else {
        setEmailError('');
      }
    }

    if (name === 'birth_date') {
      const today = new Date();
      const birthDate = new Date(value);
      const minDate = new Date('1900-01-01');
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (phoneError) {
      openModal('warning', {
        title: '입력 오류',
        content: '전화번호 형식이 올바르지 않습니다.',
        onConfirm: () => null
      });
      return;
    }
    if (emailError) {
      openModal('warning', {
        title: '입력 오류',
        content: '이메일 형식이 올바르지 않습니다.',
        onConfirm: () => null
      });
      return;
    }
    if (birthdateError) {
      openModal('warning', {
        title: '입력 오류',
        content: '생년월일이 올바르지 않습니다.',
        onConfirm: () => null
      });
      return;
    }

    try {
      const updateData = {
        nickname: state.nickname,
        phone_num: state.phone_number,
        email: state.email,
        birthday: state.birth_date,
      };
      
      if (profileImageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          updateData.profile = reader.result.split(',')[1]; 
          
          await updateUserInfo(updateData);
          
          openModal('success', {
            title: '저장 완료',
            content: '저장되었습니다.',
            onConfirm: () => navigate('/mypage/info')
          });
        };
        reader.readAsDataURL(profileImageFile);
      } else {
        await updateUserInfo(updateData);
        
        openModal('success', {
          title: '저장 완료',
          content: '저장되었습니다.',
          onConfirm: () => navigate('/mypage/info')
        });
      }
    } catch (error) {
      openModal('error', {
        title: '저장 실패',
        content: error.message || '정보 수정에 실패했습니다. 다시 시도해주세요.',
        onConfirm: () => null
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ name: 'profile_image', value: reader.result });
        setProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark px-4">
        <div className="w-full max-w-md relative pt-[100px] pb-8 flex flex-col gap-3 items-center bg-yl100 dark:bg-darktext rounded-3xl shadow-lg">
          <BackButton to="/mypage/info" />

          <div className="absolute -top-[92px]">
            <div
              className="w-[184px] h-[184px] rounded-full overflow-hidden shadow-xl border-4 cursor-pointer"
              style={{ borderColor: "transparent" }}
              onClick={handleImageClick}
            >
              <img
                src={getProfileImageUrl()}
                alt="프로필 이미지"
                className="w-full h-full object-cover"
                onError={e => { e.target.src = "/profile.png"; }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white">이미지 변경</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <form onSubmit={handleSubmit} className="w-full mt-2 px-6">
            <div className="flex flex-col gap-8 items-center">
              <div className="flex flex-col gap-3 w-full max-w-[500px]">
                <FormInput
                  label="닉네임"
                  name="nickname"
                  value={state.nickname}
                  onChange={handleChange}
                  className="w-full"
                />
                <FormInput
                  label="전화번호"
                  name="phone_number"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={state.phone_number}
                  onChange={handleChange}
                  error={phoneError}
                  className="w-full"
                />
                <FormInput
                  label="이메일"
                  name="email"
                  type="text"
                  value={state.email}
                  onChange={handleChange}
                  error={emailError}
                  className="w-full"
                />
                <FormInput
                  label="생년월일"
                  name="birth_date"
                  type="date"
                  value={state.birth_date}
                  onChange={handleChange}
                  min="1900-01-01"
                  max={today}
                  error={birthdateError}
                  className="w-full"
                />
              </div>

              <div className="w-full max-w-[500px]">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? '저장 중...' : '저장하기'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}